import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { AlertTriangle, Loader2 } from "lucide-react";

export default function LowStock() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const LOW_STOCK_LIMIT = 5;

  const fetchStock = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("stock")
      .select("*");

    if (error) {
      console.error("Error fetching stock:", error);
    } else {
      setProducts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const lowStockProducts = products.filter(
    (p) => p.quantity <= LOW_STOCK_LIMIT
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg shadow-indigo-200">
          <AlertTriangle className="w-7 h-7 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Low Stock Alert
        </h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* Loader */}
        {loading ? (

          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>

        ) : (

          <table className="w-full text-left">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {lowStockProducts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    No Low Stock Items
                  </td>
                </tr>
              ) : (
                lowStockProducts.map((item) => (
                  <tr key={item.id} className="border-t">

                    <td className="p-4 font-medium">
                      {item.name}
                    </td>

                    <td className="p-4">
                      {item.quantity}
                    </td>

                    <td className="p-4 text-red-500 font-semibold">
                      ⚠ Low Stock
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}