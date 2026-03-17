// Request Queue Manager - Prevents server overload

class RequestQueueManager {
  constructor(options = {}) {
    this.maxQueueSize = options.maxQueueSize || 1000;
    this.maxConcurrent = options.maxConcurrent || 100;
    this.requestTimeout = options.requestTimeout || 30000; // 30 seconds
    this.multipartTimeout = options.multipartTimeout || 180000; // 3 minutes for uploads
    
    this.activeRequests = 0;
    this.queuedRequests = 0;
    this.rejectedRequests = 0;
    this.completedRequests = 0;
  }

  middleware() {
    return async (req, res, next) => {
      // Check if queue is full
      if (this.queuedRequests >= this.maxQueueSize) {
        this.rejectedRequests++;
        return res.status(503).json({
          success: false,
          message: 'Server is overloaded. Please try again later.',
          error: 'SERVICE_UNAVAILABLE',
          retryAfter: 30,
        });
      }

      // Check if too many concurrent requests
      if (this.activeRequests >= this.maxConcurrent) {
        this.queuedRequests++;
        
        // Wait for slot to be available
        await this.waitForSlot();
        this.queuedRequests--;
      }

      this.activeRequests++;

      const timeoutMs = this.resolveTimeout(req);

      // Set request timeout
      const timeoutId = setTimeout(() => {
        if (!res.headersSent) {
          res.status(504).json({
            success: false,
            message: 'Request timeout',
            error: 'GATEWAY_TIMEOUT',
          });
        }
      }, timeoutMs);

      // Cleanup on response finish
      let cleanedUp = false;
      const cleanup = () => {
        if (cleanedUp) {
          return;
        }
        cleanedUp = true;
        clearTimeout(timeoutId);
        this.activeRequests = Math.max(this.activeRequests - 1, 0);
        this.completedRequests++;
      };

      res.on('finish', cleanup);
      res.on('close', cleanup);

      next();
    };
  }

  resolveTimeout(req) {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('multipart/form-data')) {
      return this.multipartTimeout;
    }
    return this.requestTimeout;
  }

  waitForSlot() {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.activeRequests < this.maxConcurrent) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 1 minute
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 60000);
    });
  }

  getStats() {
    return {
      active: this.activeRequests,
      queued: this.queuedRequests,
      rejected: this.rejectedRequests,
      completed: this.completedRequests,
      maxConcurrent: this.maxConcurrent,
      maxQueue: this.maxQueueSize,
    };
  }

  reset() {
    this.rejectedRequests = 0;
    this.completedRequests = 0;
  }
}

export default RequestQueueManager;
