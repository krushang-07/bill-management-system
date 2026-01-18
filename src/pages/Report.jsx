import { useEffect, useState } from 'react'
import { TrendingUp, Calendar, IndianRupee, Receipt, ArrowUp, DollarSign, ShoppingCart, Clock, Package, BarChart3 } from 'lucide-react'
import { supabase } from '../supabase'

export default function Report() {
  const [bills, setBills] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBills = async () => {
      const today = new Date().toISOString().slice(0, 10)

      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .eq('date', today)

      if (!error) {
        setBills(data || [])
      }
      setIsLoading(false)
    }

    fetchBills()
  }, [])

  const total = bills.reduce((sum, bill) => sum + (bill.total || 0), 0)
  const billCount = bills.length

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-64 bg-slate-200 rounded"></div>
          <div className="h-32 w-80 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-purple-900 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">{formatDate()}</span>
              </div>
              <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg shadow-indigo-200">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Daily Report
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Track and manage your Earnings & Bills
              </p>
            </div>
          </div>
        </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200">
              <Clock className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">{formatTime()}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Total Sales Card */}
          <div className="group bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <IndianRupee className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-1 text-white/90 text-sm bg-white/20 px-3 py-1 rounded-full">
                <ArrowUp className="w-4 h-4" />
                <span>Live</span>
              </div>
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Total Sales</p>
              <h2 className="text-5xl font-bold text-white mb-1">
                {formatCurrency(total)}
              </h2>
              <p className="text-white/70 text-sm">Revenue generated today</p>
            </div>
          </div>

          {/* Bills Count Card */}
          <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span>Active</span>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium mb-2">Total Transactions</p>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                {billCount}
              </h2>
              <p className="text-slate-500 text-sm">Bills processed today</p>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-xs font-medium text-slate-600 mb-1">Average Bill Value</p>
              <p className="text-2xl font-bold text-slate-800">
                {billCount > 0 ? formatCurrency(total / billCount) : formatCurrency(0)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
              <p className="text-xs font-medium text-slate-600 mb-1">Highest Sale</p>
              <p className="text-2xl font-bold text-slate-800">
                {bills.length > 0 ? formatCurrency(Math.max(...bills.map(b => b.total))) : formatCurrency(0)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <p className="text-xs font-medium text-slate-600 mb-1">Lowest Sale</p>
              <p className="text-2xl font-bold text-slate-800">
                {bills.length > 0 ? formatCurrency(Math.min(...bills.map(b => b.total))) : formatCurrency(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Bills List */}
        {billCount > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                Recent Transactions
              </h3>
            </div>
            <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
              {bills.slice(0, 10).map((bill) => (
                <div key={bill.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Bill #{bill.id}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(bill.date).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">{formatCurrency(bill.total)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No sales yet today</h3>
            <p className="text-slate-600">Your first transaction will appear here</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}