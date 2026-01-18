import { useEffect, useState } from 'react'
import {
  Package,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Trash2,
  Check,
  X,
  ShoppingCart,
  Layers
} from 'lucide-react'
import { supabase } from '../supabase'

export default function Stock() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [variant, setVariant] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    variant: '',
    category_id: '',
    price: 0,
    quantity: 0
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const loadStock = async () => {
    const { data } = await supabase
      .from('stock')
      .select('*, categories(name)')
    setItems(data || [])
  }

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  useEffect(() => {
    loadStock()
    loadCategories()
  }, [])

  const addItem = async () => {
    if (!name || !price || !qty || !categoryId) return

    await supabase.from('stock').insert({
      name,
      variant,
      category_id: categoryId,
      price: Number(price),
      quantity: Number(qty)
    })

    setName('')
    setVariant('')
    setCategoryId('')
    setPrice('')
    setQty('')
    setShowAddForm(false)
    loadStock()
  }

  const deleteItem = async (id) => {
    await supabase.from('stock').delete().eq('id', id)
    loadStock()
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      variant: item.variant || '',
      category_id: item.category_id,
      price: item.price,
      quantity: item.quantity
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id) => {
    await supabase.from('stock').update(editForm).eq('id', id)
    cancelEdit()
    loadStock()
  }

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalValue = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const lowStockCount = items.filter(item => item.quantity < 3).length

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg shadow-indigo-200">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Stock Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Track and manage your inventory
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Items</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{items.length}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Value</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-slate-500">Low Stock</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{lowStockCount}</p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-indigo-600 transition-all hover:shadow-lg group"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Add Item</span>
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                <Plus className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-slate-900"
              >
                <option value="">Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <input
                placeholder="Product Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              <input
                placeholder="Variant( 5rs, 100ml.. )"
                value={variant}
                onChange={e => setVariant(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              <input
                type="number"
                placeholder="Quantity"
                value={qty}
                onChange={e => setQty(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />

              <div className="flex gap-2">
                <button
                  onClick={addItem}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {editingId === item.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="px-3 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })}
                            className="px-3 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editForm.quantity}
                            onChange={e => setEditForm({ ...editForm, quantity: Number(e.target.value) })}
                            className="px-3 py-2 border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-medium">
                          {formatCurrency(editForm.price * editForm.quantity)}
                        </td>
                        <td></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => saveEdit(item.id)}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                              <ShoppingCart className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                            <p className="font-semibold text-slate-900">
  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
</p>
                              {/* {item.variant && (
                                <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                              )} */}
                              {item.categories?.name && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md">
                                  {item.categories.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-medium">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-900 font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="px-6 py-4">
                          {item.quantity < 3 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => startEdit(item)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}