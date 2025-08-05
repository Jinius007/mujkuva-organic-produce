

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Try to get the last checkout data from sessionStorage
    const stored = sessionStorage.getItem('checkoutData');
    if (stored) {
      try {
        setOrderDetails(JSON.parse(stored));
      } catch (e) {
        setOrderDetails(null);
      }
    }
    // Optionally clear sessionStorage after loading
    // sessionStorage.removeItem('checkoutData');
  }, []);

  if (!orderDetails) {
    return (
      <div className="page-transition pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-organic-800">Order Confirmed!</h1>
            <p className="mb-6">Thank you for your order. Your payment has been received.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-organic-800">Order Confirmed!</h1>
          <p className="mb-6">Thank you for your order. Your payment has been received.</p>
          <div className="mb-6 text-left">
            <h2 className="font-semibold mb-2">Order Details:</h2>
            <ul className="mb-2">
              {orderDetails.items.map((item, idx) => (
                <li key={item.id} className="mb-1">
                  {item.name} x {item.quantity} @ ₹{item.price} each
                </li>
              ))}
            </ul>
            <div className="mb-2">Total: <span className="font-bold">₹{orderDetails.total}</span></div>
            <div className="mb-2">Name: <span className="font-bold">{orderDetails.customerDetails.name}</span></div>
            <div className="mb-2">Phone: <span className="font-bold">{orderDetails.customerDetails.phone}</span></div>
            <div className="mb-2">Address: <span className="font-bold">{orderDetails.customerDetails.address}</span></div>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
