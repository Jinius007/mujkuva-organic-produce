import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const navigate = useNavigate();
  const { state, updateQuantity, removeFromCart, clearCart, refreshStockData } = useCart();
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleProceedToPayment = async () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      toast.error("Please fill in all customer details");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting to save orders to database...', { items: state.items, customerDetails });
      
      // Check for existing reserved orders for this customer
      const { data: existingReservations, error: checkError } = await supabase
        .from('order_slots')
        .select('id')
        .eq('customer_name', customerDetails.name)
        .eq('customer_phone', customerDetails.phone)
        .eq('status', 'reserved')
        .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()); // Last 30 minutes

      if (checkError) {
        console.error('Error checking existing reservations:', checkError);
        throw new Error('Failed to check existing orders');
      }

      if (existingReservations && existingReservations.length > 0) {
        toast.error('You already have a pending order. Please complete your payment first.');
        return;
      }
      
      // Save each item as a separate order in the database
      const orderDate = new Date().toISOString().slice(0, 10); // Today's date
      const orderPromises = state.items.map(item => {
        const weightKg = item.quantity * 0.5; // 0.5kg per unit
        
        const orderData = {
          product_id: item.id,
          product_name: item.name,
          customer_name: customerDetails.name,
          customer_phone: customerDetails.phone,
          customer_address: customerDetails.address,
          quantity: item.quantity,
          weight_kg: weightKg,
          total_price: item.price * item.quantity,
          order_date: orderDate,
          status: 'reserved', // Reserve slots when user proceeds to payment
          transaction_id: null, // Will be updated after payment
          payment_screenshot_path: null // Will be updated after payment
        };
        
        console.log('Inserting order:', orderData);
        return supabase.from('order_slots').insert(orderData);
      });

      const results = await Promise.all(orderPromises);
      
      // Check for errors in any of the insert operations
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Database insert errors:', errors);
        throw new Error(`Failed to save ${errors.length} orders. Please try again.`);
      }

      console.log('All orders saved successfully:', results);

      // Store checkout data for payment page
      const checkoutData = {
        items: state.items,
        total: state.total,
        customerDetails
      };
      
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      
      // Clear cart and refresh stock data
      clearCart();
      await refreshStockData();
      
      toast.success("Order details saved! Proceed to payment.");
      
      // Navigate to checkout/payment page
      navigate("/checkout");
      
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error("Failed to save order details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-bold text-organic-800">Your Cart</h1>
            <button
              onClick={() => navigate("/produce")}
              className="flex items-center text-organic-600 hover:text-organic-700 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </button>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <ShoppingBag size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some products to get started</p>
              <button
                onClick={() => navigate("/produce")}
                className="btn-primary"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-gray-600">₹{item.price} per {item.unit}</p>
                           <p className="text-sm text-gray-500">
                            {item.id === 'dudhi' 
                              ? `${item.quantity} pieces total`
                              : `${(item.quantity * 0.5).toFixed(1)}kg total`
                            }
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-organic-800">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors mt-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({state.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span>₹{state.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold text-organic-800">
                        <span>Total</span>
                        <span>₹{state.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-gray-800">Delivery Details</h3>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="input-field"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                      className="input-field"
                    />
                    <textarea
                      placeholder="Delivery Address"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                      className="input-field"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!customerDetails.name || !customerDetails.phone || !customerDetails.address || isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>{isSubmitting ? 'Saving Order...' : 'Make Payment'}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;