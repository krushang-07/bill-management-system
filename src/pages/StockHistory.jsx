import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { History, Loader2 } from "lucide-react";

export default function StockHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {

    setLoading(true);

    const { data, error } = await supabase
      .from("history")
      .select(`
        id,
        change_quantity,
        action,
        created_at,
        stock(name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setHistory(data); // ✅ IMPORTANT FIX
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  console.log("history:", history);

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg shadow-indigo-200">
          <History className="w-7 h-7 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">
          Stock History
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (

          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>

        ) : (

          <table className="w-full text-left">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>

              {history.length === 0 ? (

                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No Stock History Found
                  </td>
                </tr>

              ) : (

                history.map((item) => (

                  <tr key={item.id} className="border-t">

                    {/* ✅ FIXED */}
                    <td className="p-4 font-medium">
                      {item.stock?.name || "Unknown"}
                    </td>

                    {/* ✅ FIXED */}
                    <td className="p-4">
                      {item.change_quantity}
                    </td>

                    {/* ✅ FIXED */}
                    <td className={`p-4 font-semibold ${
                      item.action === "Added"
                        ? "text-green-600"
                        : item.action === "Removed"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}>
                      {item.action}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(item.created_at).toLocaleString()}
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