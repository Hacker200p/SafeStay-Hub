import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { register, verifyOTP, resendOTP, error, loading, clearError } = useAuthStore()
  const [step, setStep] = useState('form') // form, otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userRole: 'tenant', // tenant, owner, provider, admin
  })
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendLoading, setResendLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    let finalValue = value

    // Clean phone number - remove all non-digits
    if (name === 'phoneNumber') {
      finalValue = value.replace(/\D/g, '').slice(0, 10)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
    clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setOtpError('Passwords do not match')
      return
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        userRole: formData.userRole,
      })
      setStep('otp')
      setOtpError('')
    } catch (err) {
      console.error('Registration error:', err)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()

    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits')
      return
    }

    console.log('[REGISTER] Verifying OTP:', { phone: formData.phoneNumber, otp })

    try {
      const result = await verifyOTP({
        phone: formData.phoneNumber,
        otp,
      })
      console.log('[REGISTER] OTP verification successful:', result)
      navigate('/dashboard')
    } catch (err) {
      console.error('[REGISTER] OTP verification error:', err)
      setOtpError(err.response?.data?.message || 'OTP verification failed')
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    try {
      await resendOTP({ phone: formData.phoneNumber })
      setOtpError('New OTP sent to your phone number')
      setOtp('')
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">SafeStay Hub</h1>
        <h2 className="text-2xl font-bold text-center mb-6 text-text-dark">
          {step === 'form' ? 'Create Account' : 'Verify Phone Number'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Registration Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9876543210"
                className="input w-full"
                maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
                required
              />
              <p className="text-xs text-text-muted mt-1">Enter 10-digit mobile number without spaces or country code</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">I am a:</label>
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className="input w-full"
              >
                <option value="tenant">Tenant</option>
                <option value="owner">Hostel Owner</option>
                <option value="provider">Canteen Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Continue to OTP'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-text-muted text-sm mb-4">
              We've sent a 6-digit verification code to your phone number. Enter it below.
            </p>

            {otpError && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  otpError.includes('sent')
                    ? 'bg-success/10 border border-success text-success'
                    : 'bg-danger/10 border border-danger text-danger'
                }`}
              >
                {otpError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.slice(0, 6).replace(/\D/g, ''))
                  setOtpError('')
                }}
                placeholder="000000"
                maxLength="6"
                className="input w-full text-center text-2xl tracking-widest"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('form')
                setOtp('')
                setOtpError('')
              }}
              className="text-center text-text-muted hover:text-primary text-sm w-full mt-2"
            >
              Back to form
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
