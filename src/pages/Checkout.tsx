import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Upload, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useCart } from "@/contexts/CartContext";

interface CheckoutData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
}

const Checkout = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Get checkout data from sessionStorage
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      const data = JSON.parse(storedData);
      // Remove restriction: allow all products
      setCheckoutData(data);
    } else {
      navigate('/cart');
      toast.error('No checkout data found.');
    }
  }, [navigate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleOrderSubmit = async () => {
    if (!checkoutData || !transactionId.trim()) {
      toast.error('Please enter transaction ID');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload payment screenshot');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment_screenshots')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Insert each item as a separate order in the database
      const orderDate = new Date().toISOString().slice(0, 10); // Today's date
      const orderPromises = checkoutData.items.map(item => {
        const weightKg = item.quantity * 0.5; // 0.5kg per unit
        return supabase.from('order_slots').insert({
          product_id: item.id,
          product_name: item.name,
          customer_name: checkoutData.customerDetails.name,
          customer_phone: checkoutData.customerDetails.phone,
          customer_address: checkoutData.customerDetails.address,
          quantity: item.quantity,
          weight_kg: weightKg,
          total_price: item.price * item.quantity,
          order_date: orderDate,
          status: 'pending',
          transaction_id: transactionId,
          payment_screenshot_path: uploadData?.path || null
        });
      });

      const results = await Promise.all(orderPromises);
      const hasErrors = results.some(result => result.error);
      if (hasErrors) {
        throw new Error('Failed to save some orders');
      }

      // Clear cart and checkout data
      clearCart();
      sessionStorage.removeItem('checkoutData');
      setIsOrderComplete(true);
      toast.success('Order placed successfully!');
      // Navigate to order confirmation after 3 seconds
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderId: results[0]?.data?.[0]?.id || Date.now().toString(),
            orderData: checkoutData 
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state while checking checkout data
  if (!checkoutData) {
    return (
      <div className="page-transition pt-24">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-organic-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {isOrderComplete ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={48} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-8">
                Thank you for your order. You will receive a confirmation shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-organic-800 mb-6">Order Summary</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="space-y-4 mb-6">
                    {checkoutData.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} units ({(item.quantity * 0.5).toFixed(1)}kg)
                          </p>
                        </div>
                        <span className="font-semibold text-organic-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-organic-800">
                      <span>Total</span>
                      <span>₹{checkoutData.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-800 mb-2">Delivery Details</h4>
                    <p className="text-gray-600">{checkoutData.customerDetails.name}</p>
                    <p className="text-gray-600">{checkoutData.customerDetails.phone}</p>
                    <p className="text-gray-600">{checkoutData.customerDetails.address}</p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="text-2xl font-serif font-bold text-organic-800 mb-6">Payment</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  {/* QR Code Section */}
                  <div className="text-center mb-8">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <img 
                        src="/lovable-uploads/kdcc-qr.png" 
                        alt="KDCC Payment QR Code" 
                        className="w-48 h-48 object-contain rounded" 
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Scan QR code to pay ₹{checkoutData.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      UPI ID: yespay.kdccska12410525@yesbankltd
                    </p>
                  </div>

                  {/* Payment Confirmation */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transaction ID
                      </label>
                      <input
                        type="text"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="Enter transaction ID from payment app"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Payment Screenshot
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-organic-400 transition-colors"
                      >
                        {filePreview ? (
                          <div className="space-y-2">
                            <img 
                              src={filePreview} 
                              alt="Payment screenshot" 
                              className="max-h-32 mx-auto rounded"
                            />
                            <p className="text-sm text-gray-600">Click to change image</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload size={32} className="mx-auto text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Click to upload payment screenshot
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    <button
                      onClick={handleOrderSubmit}
                      disabled={isUploading || !transactionId.trim() || !selectedFile}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;