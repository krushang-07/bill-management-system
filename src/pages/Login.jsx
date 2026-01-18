// import { useState } from "react";
// import { supabase } from "../supabase";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setLoading(false);

//     if (error) {
//       setError(error.message);
//     } else {
//       window.location.href = "/"; // Redirect to main app
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
//       <div className="flex items-center gap-3">
//             <img
//               src="/logo.jpg"
//               alt="Bansi Ice-cream"
//               className="h-16 w-auto object-contain rounded-3xl"
//             />
//           </div>

//         {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

//         <form onSubmit={handleLogin} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full pl-4 pr-4 py-3 rounded-lg border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
