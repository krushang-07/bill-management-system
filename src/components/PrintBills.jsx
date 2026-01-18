export default function PrintBill({ bill, items, seller, contact }) {
    return (
      <div id="print-area" className="p-3 text-sm">
        <h1 className="text-center font-bold text-lg">
          Bansi Ice Cream
        </h1>
        <p className="text-center">Contact: {contact}</p>
        <p>Seller: {seller}</p>
        <hr />
  
        {items.map((i, idx) => (
          <div key={idx} className="flex justify-between">
            <span>{i.name} x {i.qty}</span>
            <span>₹{i.qty * i.price}</span>
          </div>
        ))}
  
        <hr />
        <p>Total: ₹{bill.total}</p>
        <p>Cash: ₹{bill.cash}</p>
        <p>UPI: ₹{bill.upi}</p>
  
        <hr />
        <p className="text-center">Thank You 🍦</p>
      </div>
    );
  }
  