import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Save, 
  User, 
  Phone,
  CreditCard,
  Wallet,
  Package,
  Receipt
} from "lucide-react";

export default function Bill() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [cart, setCart] = useState([]);
  const [seller, setSeller] = useState("");
  const [contact, setContact] = useState("");
  const [cash, setCash] = useState("");
  const [upi, setUpi] = useState("");
  const [lastBill, setLastBill] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      const { data: stockData } = await supabase.from("stock").select("*");
      const { data: categoryData } = await supabase.from("categories").select("*");

      setItems(stockData || []);
      setCategories(categoryData || []);
    };

    loadData();
  }, []);

  /* ================= CATEGORY FILTER ================= */
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter(item => item.category_id === selectedCategory);

  /* ================= CART LOGIC ================= */
  const addItem = (item) => {
    if (item.quantity === 0) return;

    const exist = cart.find(c => c.id === item.id);
    if (exist) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (index, change) => {
    const copy = [...cart];
    const newQty = copy[index].qty + change;
    if (newQty > 0) {
      copy[index].qty = newQty;
      setCart(copy);
    }
  };

  const removeItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  /* ================= SAVE BILL ================= */
  const saveBill = async () => {
    const cashAmt = Number(cash) || 0;
    const upiAmt = Number(upi) || 0;

    if (!seller) return alert("Please enter seller name");
    if (cart.length === 0) return alert("Cart is empty");
    if (cashAmt + upiAmt !== total)
      return alert("Cash + UPI must equal Total amount");

    try {
      const { data: bill } = await supabase
        .from("bills")
        .insert({
          total,
          cash: cashAmt,
          upi: upiAmt,
          date: new Date().toISOString().slice(0, 10)
        })
        .select()
        .single();

      for (let i of cart) {
        await supabase.from("bill_items").insert({
          bill_id: bill.id,
          item_name: i.name,
          qty: i.qty,
          price: i.price,
          subtotal: i.qty * i.price,
        });

        await supabase
          .from("stock")
          .update({ quantity: i.quantity - i.qty })
          .eq("id", i.id);
      }

      setLastBill({ bill, items: cart, seller, contact });

      setCart([]);
      setSeller("");
      setContact("");
      setCash("");
      setUpi("");

      setTimeout(() => window.print(), 100);

      const { data } = await supabase.from("stock").select("*");
      setItems(data || []);
    } catch (error) {
      alert("Error saving bill: " + error.message);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  const remaining = total - (Number(cash) || 0) - (Number(upi) || 0);

  return (
    <>
      <div className="print:hidden min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">

                  {/* HEADER unchanged */}
                  
                  <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg shadow-indigo-200">
              <Receipt className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Bill Management
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Create and print your bills
              </p>
            </div>
          </div>
        </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

                          {/* CUSTOMER INFO unchanged */}
                          
                          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
  <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
    <User className="w-5 h-5 text-purple-600" />
    Customer Information
  </h2>
  <div className="grid md:grid-cols-2 gap-4">
    <div className="relative">
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder="Seller Name *"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
        className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
      />
    </div>
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input
        type="text"
        placeholder="Contact Number (Optional)"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
      />
    </div>
  </div>
</div>

              {/* CATEGORY FILTER (LOGIC ONLY ADDITION) */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                >
                  <option value="all">All Products</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRODUCT MENU */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Product Menu
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => addItem(item)}
                      disabled={item.quantity === 0}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                        item.quantity === 0
                          ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-50'
                          : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400 hover:shadow-lg hover:scale-105'
                      }`}
                    >
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-semibold text-slate-900">
  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
</p>
                        <p className={`text-xs mt-1 ${item.quantity < 5 ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                          Stock: {item.quantity}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - Cart & Payment */}
            <div className="space-y-6">
              {/* SHOPPING CART */}
              <div className="bg-white h-full rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-6">
                <div className="p-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart ({cart.length})
                  </h2>
                </div>

                <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">Cart is empty</p>
                      <p className="text-xs text-slate-400 mt-1">Add items from menu</p>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-slate-50 to-purple-50 p-4 rounded-xl border border-purple-100"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-600">{formatCurrency(item.price)} each</p>
                          </div>
                          <button
                            onClick={() => removeItem(idx)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(idx, -1)}
                              className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-slate-600" />
                            </button>
                            <span className="w-12 text-center font-semibold text-slate-800">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(idx, 1)}
                              className="p-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                          <p className="text-lg font-bold text-purple-600">
                            {formatCurrency(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* PAYMENT SECTION */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-purple-50">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-slate-700">Total Amount</span>
                      <span className="text-3xl font-bold text-purple-600">
                        {formatCurrency(total)}
                      </span>
                    </div>

                    {/* PAYMENT INPUTS */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          placeholder="Cash Amount"
                          value={cash}
                          onChange={(e) => setCash(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                        />
                      </div>
                      {/* <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          placeholder="UPI Amount"
                          value={upi}
                          onChange={(e) => setUpi(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                        />
                      </div> */}

                      {/* Payment Status */}
                      {(cash || upi) && (
                        <div className={`p-3 rounded-lg ${remaining === 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                          <p className={`text-sm font-medium ${remaining === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {remaining === 0 ? '✓ Payment Complete' : remaining > 0 ? `Remaining: ${formatCurrency(remaining)}` : `Excess: ${formatCurrency(Math.abs(remaining))}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* SAVE & PRINT BUTTON */}
                    <div className="mt-4">
                      <button
                        onClick={saveBill}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        Save & Print Bill
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT BILL - Only visible during print */}
     {/* PRINT BILL - Only visible during print */}
{lastBill && (
  <>
    <style>{`
      @media print {
        @page {
          size: auto;
          margin: 0;
        }
        body * {
          visibility: hidden;
        }
        #print-bill, #print-bill * {
          visibility: visible;
        }
        #print-bill {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }
        .single-bill {
          width: calc(50% - 6px);
          box-sizing: border-box;
        }
      }
    `}</style>

    <div id="print-bill" className="hidden print:flex">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="single-bill"
          style={{ 
            padding: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '13px',
            lineHeight: '1.4',
            color: '#000',
            border: '1px dashed #000'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', width: '100%' }}>
  {/* Logo on the left */}
  <div>
    <img 
      src="/logo.jpg" 
      alt="Logo" 
      style={{ width: '100px', height: 'auto', borderRadius: '8px' }} 
    />
  </div>

  {/* Invoice title & contact on the right */}
  <div style={{ textAlign: 'right' }}>
    <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '0.5px' }}>
      INVOICE
    </h1>
    {lastBill.contact && (
      <p style={{ fontSize: '12px', margin: '0', color: '#444' }}>
        {lastBill.contact}
      </p>
    )}
  </div>
</div>


          {/* Bill Info */}
          <div style={{ marginBottom: '12px' }}>
            <table style={{ width: '100%', fontSize: '12px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '3px 0', fontWeight: '600' }}>Bill No:</td>
                  <td style={{ padding: '3px 0', textAlign: 'right' }}>#{lastBill.bill.id}</td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0', fontWeight: '600' }}>Date:</td>
                  <td style={{ padding: '3px 0', textAlign: 'right' }}>
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '3px 0', fontWeight: '600' }}>Time:</td>
                  <td style={{ padding: '3px 0', textAlign: 'right' }}>
                    {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </td>
                </tr>
                {lastBill.seller && (
                  <tr>
                    <td style={{ padding: '3px 0', fontWeight: '600' }}>Seller:</td>
                    <td style={{ padding: '3px 0', textAlign: 'right' }}>{lastBill.seller}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '12px' }}>
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #000', fontWeight: '700' }}>
                  <th style={{ textAlign: 'left', padding: '6px 0', fontSize: '11px' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '6px 4px', fontSize: '11px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: '11px' }}>Rate</th>
                  <th style={{ textAlign: 'right', padding: '6px 0', fontSize: '11px' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {lastBill.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 0', borderBottom: idx === lastBill.items.length - 1 ? 'none' : '1px dotted #ccc' }}>{item.name}</td>
                    <td style={{ textAlign: 'center', padding: '6px 4px', borderBottom: idx === lastBill.items.length - 1 ? 'none' : '1px dotted #ccc' }}>{item.qty}</td>
                    <td style={{ textAlign: 'right', padding: '6px 0', borderBottom: idx === lastBill.items.length - 1 ? 'none' : '1px dotted #ccc' }}>₹{item.price.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '6px 0', fontWeight: '600', borderBottom: idx === lastBill.items.length - 1 ? 'none' : '1px dotted #ccc' }}>₹{(item.qty * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', padding: '6px 0', marginBottom: '8px' }}>
              <span>TOTAL</span>
              <span>₹{lastBill.bill.total.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '12px', borderTop: '1px dashed #666', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                <span>Cash Paid:</span>
                <span style={{ fontWeight: '600' }}>₹{lastBill.bill.cash.toFixed(2)}</span>
              </div>
              {lastBill.bill.upi > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                  <span>UPI Paid:</span>
                  <span style={{ fontWeight: '600' }}>₹{lastBill.bill.upi.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>
              Thank You! 🍦
            </p>
            <p style={{ fontSize: '11px', margin: '4px 0', color: '#666' }}>Visit Again</p>
            <p style={{ fontSize: '10px', margin: '12px 0 0 0', fontWeight: '700', letterSpacing: '1px' }}>
              {copy === 0 ? '*** CUSTOMER COPY ***' : '*** SELLER COPY ***'}
            </p>
          </div>
        </div>
      ))}
    </div>
  </>
)}

    </>
  );
}