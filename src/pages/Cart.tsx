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
    if (newQuantity < 0.25) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  // URGENT: This creates RESERVED orders when user clicks Make Payment
  const handleProceedToPayment = async () => {
    if (!customerDetails.name.trim() || !customerDetails.phone.trim() || !customerDetails.address.trim()) {
      toast.error("Please fill in all delivery details");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 Starting payment process...');
      console.log('Customer details:', customerDetails);
      console.log('Cart items:', state.items);
      console.log('Supabase client:', supabase);

      // Test Supabase connection first
      console.log('🔍 Testing Supabase connection...');
      const { data: testData, error: testError } = await supabase
        .from('order_slots')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError);
        toast.error('Database connection failed. Please try again.');
        return;
      }
      console.log('✅ Supabase connection test passed');

      // Create RESERVED status orders for each product immediately
      const reservationPromises = state.items.map(async (item) => {
        const orderId = crypto.randomUUID();
        const orderData = {
          id: orderId,
          product_id: item.id,
          product_name: item.name,
          customer_name: customerDetails.name.trim(),
          customer_phone: customerDetails.phone.trim(),
          customer_address: customerDetails.address.trim(),
          quantity: Math.round(item.quantity * 100) / 100, // Ensure proper numeric format
          weight_kg: parseFloat(item.quantity.toFixed(2)), // Ensure proper numeric format
          total_price: parseFloat((item.price * item.quantity).toFixed(2)), // Ensure proper numeric format
          order_date: new Date().toISOString().split('T')[0],
          status: 'reserved', // Status: RESERVED (not confirmed yet)
          transaction_id: null, // No transaction ID yet
          payment_screenshot_path: null // No screenshot yet
        };

        console.log(`📝 Creating RESERVED order for ${item.name}:`, orderData);
        const result = await supabase.from('order_slots').insert(orderData).select();
        
        if (result.error) {
          console.error(`❌ Failed to create reservation for ${item.name}:`, result.error);
          console.error('   Error code:', result.error.code);
          console.error('   Error message:', result.error.message);
          console.error('   Error details:', result.error.details);
          console.error('   Error hint:', result.error.hint);
        } else {
          console.log(`✅ Successfully created reservation for ${item.name}:`, result.data);
        }
        
        return result;
      });

      // Insert all reservation records
      const reservationResults = await Promise.all(reservationPromises);
      
      // Check for any errors - CRITICAL: Don't proceed if any insert fails
      const errors = reservationResults.filter(result => result.error);
      if (errors.length > 0) {
        console.error('❌ CRITICAL: Some reservations failed to create:', errors);
        errors.forEach((error, index) => {
          console.error(`   Error ${index + 1}:`, error.error);
          console.error(`   Full error object:`, JSON.stringify(error.error, null, 2));
        });
        toast.error(`Failed to create orders. Please check console for details and try again.`);
        setIsSubmitting(false);
        return; // Stop here - don't proceed to checkout
      }

      // Extract reservation IDs with better error handling
      const reservationIds: string[] = [];
      reservationResults.forEach((result, index) => {
        if (result.error) {
          console.error(`❌ Reservation ${index + 1} failed:`, result.error);
        } else if (result.data && result.data.length > 0) {
          const id = result.data[0].id;
          if (id) {
            reservationIds.push(id);
            console.log(`✅ Reservation ${index + 1} created with ID:`, id);
          } else {
            console.error(`❌ Reservation ${index + 1} created but no ID returned:`, result.data);
          }
        } else {
          console.error(`❌ Reservation ${index + 1} returned no data:`, result);
        }
      });

      // CRITICAL: Verify we have reservation IDs before proceeding
      if (reservationIds.length === 0) {
        console.error('❌ CRITICAL: No reservation IDs were created!');
        toast.error('Failed to create orders. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (reservationIds.length !== state.items.length) {
        console.warn(`⚠️ Warning: Only ${reservationIds.length} of ${state.items.length} orders were created`);
        toast.warning(`Only ${reservationIds.length} of ${state.items.length} orders were created. Please check your order.`);
      }

      console.log('📋 All reservation IDs:', reservationIds);
      console.log('📊 Reservation summary:', {
        total: reservationResults.length,
        successful: reservationIds.length,
        failed: errors.length
      });

      // Store checkout data in sessionStorage for the checkout page
      const checkoutData = {
        items: state.items,
        total: state.total,
        customerDetails: customerDetails,
        reservationIds: reservationIds // Store reservation IDs
      };
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      toast.success('Products reserved! Proceeding to payment...');

      // Navigate to checkout page
      navigate('/checkout');

    } catch (error) {
      console.error('Error creating reservations:', error);
      toast.error('Failed to reserve products. Please try again.');
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
                            {item.quantity}kg total
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 0.25)}
                            disabled={item.quantity <= 0.25}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity} kg</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 0.25)}
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
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                    disabled={isSubmitting}
                  >
                    <span>Make Payment</span>
                    <ArrowRight size={20} />
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