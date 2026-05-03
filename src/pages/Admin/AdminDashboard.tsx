import { useState, useEffect } from 'react'

interface StripeOrder {
  id: string
  created: number
  amount: number
  profileId: string
  apps: string
  customerEmail: string
  status: string
}

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminSecret, setAdminSecret] = useState('')
  const [orders, setOrders] = useState<StripeOrder[]>([])
  const [loading, setLoading] = useState(false)

  // Check if already authenticated (from sessionStorage)
  useEffect(() => {
    const savedSecret = sessionStorage.getItem('dog-and-bone-admin-secret')
    if (savedSecret) {
      setAdminSecret(savedSecret)
      setIsAuthenticated(true)
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const correctSecret = import.meta.env.VITE_ADMIN_SECRET || '886e7b2a7e3523a84b45f177c0a29a'

    if (adminSecret === correctSecret) {
      setIsAuthenticated(true)
      sessionStorage.setItem('dog-and-bone-admin-secret', adminSecret)
      fetchOrders()
    } else {
      alert('Invalid admin secret')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminSecret('')
    sessionStorage.removeItem('dog-and-bone-admin-secret')
    setOrders([])
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/.netlify/functions/list-orders?secret=${adminSecret}&limit=50`)

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      alert('Failed to load orders. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const generateSetupScript = (orderId: string) => {
    const url = `/.netlify/functions/generate-setup-script?orderId=${orderId}&secret=${adminSecret}`
    window.open(url, '_blank')
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center p-4">
        <div className="bg-white border-2 border-[#2C1503] rounded-2xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-[#2C1503] mb-6">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="secret" className="block text-sm font-semibold text-[#2C1503] mb-2">
                Admin Secret
              </label>
              <input
                id="secret"
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full px-4 py-2 border-2 border-[#F5EDD8] rounded-lg focus:border-[#FFB703] focus:outline-none"
                placeholder="Enter admin secret"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#FFB703] text-[#2C1503] font-bold py-3 rounded-lg hover:bg-[#E6A500] transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      {/* Header */}
      <header className="bg-[#2C1503] border-b-2 border-[#FFB703]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dog and Bone Admin</h1>
          <button
            onClick={handleLogout}
            className="text-white/80 hover:text-white text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#2C1503] mb-2">Recent Orders</h2>
          <p className="text-sm text-[#5A4A3A]">
            Manage orders, generate setup scripts, and track device inventory.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#5A4A3A]">Loading orders...</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#2C1503] rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#2C1503] text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold">Order ID</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Profile</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EDD8]">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#5A4A3A]">
                      No orders yet. This will populate with Stripe orders automatically.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FFF8E7]">
                      <td className="px-4 py-3 text-sm font-mono">{order.id}</td>
                      <td className="px-4 py-3 text-sm">{order.customerEmail}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 bg-[#FFB703] text-[#2C1503] text-xs font-bold rounded">
                          {order.profileId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        £{(order.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => generateSetupScript(order.id)}
                          className="text-sm font-semibold text-[#2C1503] hover:text-[#FFB703] transition-colors"
                        >
                          Generate Script
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Coming Soon */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-[#F5EDD8] rounded-xl p-6">
            <h3 className="font-bold text-[#2C1503] mb-2">Device Inventory</h3>
            <p className="text-sm text-[#5A4A3A]">Coming soon: Track all configured devices</p>
          </div>
          <div className="bg-white border-2 border-[#F5EDD8] rounded-xl p-6">
            <h3 className="font-bold text-[#2C1503] mb-2">Remote Updates</h3>
            <p className="text-sm text-[#5A4A3A]">Coming soon: Push config changes to devices</p>
          </div>
          <div className="bg-white border-2 border-[#F5EDD8] rounded-xl p-6">
            <h3 className="font-bold text-[#2C1503] mb-2">Shipping Labels</h3>
            <p className="text-sm text-[#5A4A3A]">Coming soon: Print labels for orders</p>
          </div>
        </div>
      </div>
    </div>
  )
}
