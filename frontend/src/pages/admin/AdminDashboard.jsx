import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, Menu, X } from 'lucide-react'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'hostels', label: 'Hostels', icon: '🏢' },
    { id: 'verifications', label: 'Verifications', icon: '✓' },
    { id: 'stats', label: 'Statistics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-primary text-white transition-all duration-300 overflow-hidden fixed md:relative z-40 h-full`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">SafeStay Hub</h1>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-white text-primary font-semibold' : 'hover:bg-blue-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-primary"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className="text-2xl font-bold text-text-dark">
            {menuItems.find((item) => item.id === activeTab)?.label}
          </h2>
          <div className="text-text-muted">Admin: {user?.name}</div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Total Users</p>
                  <h3 className="text-3xl font-bold text-primary">2,450</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Active Hostels</p>
                  <h3 className="text-3xl font-bold text-accent">128</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Pending Verifications</p>
                  <h3 className="text-3xl font-bold text-orange-500">15</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Total Revenue</p>
                  <h3 className="text-3xl font-bold text-success">₹28.5L</h3>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">Quick Actions</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="btn-primary">View Pending Verifications</button>
                  <button className="btn-secondary">Generate Report</button>
                  <button className="btn-secondary">System Health</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">System Overview</h3>
                <div className="chart">
                  <p className="p-4">System metrics coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Users Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">John Doe</td>
                      <td className="px-4 py-2">john@example.com</td>
                      <td className="px-4 py-2">Tenant</td>
                      <td className="px-4 py-2"><span className="bg-green-100 px-2 py-1 rounded text-green-800">Active</span></td>
                      <td className="px-4 py-2 space-x-2">
                        <button className="text-primary text-sm hover:underline">View</button>
                        <button className="reject-btn text-xs">Suspend</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'hostels' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Hostels</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'verifications' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Pending Verifications</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Green Valley Hostel</h4>
                    <p className="text-text-muted text-sm">Owner: Raj Patel</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="approve-btn">Approve</button>
                    <button className="reject-btn">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Statistics</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Reports</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">System Settings</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
