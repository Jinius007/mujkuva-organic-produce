
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, Upload, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
interface Order {
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
  };
}
const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const orderData = localStorage.getItem("currentOrder");
    if (!orderData) {
      navigate("/produce");
      return;
    }
    try {
      const parsedOrder = JSON.parse(orderData);
      setOrder(parsedOrder);
    } catch (error) {
      console.error("Error parsing order data:", error);
      navigate("/produce");
    }
  }, [navigate]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) {
      toast.error("Please enter your transaction ID");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload your transaction screenshot");
      return;
    }
    if (!order) {
      toast.error("Order details not found");
      return;
    }
    setIsUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      const {
        error: uploadError
      } = await supabase.storage.from('payment_screenshots').upload(filePath, selectedFile);
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      const {
        error: orderError
      } = await supabase.from('orders').insert({
        product_id: order.productId,
        product_name: order.productName,
        quantity: order.quantity,
        total_price: order.totalPrice,
        customer_name: order.customerDetails.name,
        customer_phone: order.customerDetails.phone,
        customer_address: order.customerDetails.address,
        transaction_id: transactionId,
        payment_screenshot_path: filePath,
        status: 'pending'
      });
      if (orderError) {
        throw new Error(orderError.message);
      }
      setIsUploading(false);
      setIsOrderComplete(true);
      localStorage.removeItem("currentOrder");
      toast.success("Order placed successfully!");
    } catch (error) {
      setIsUploading(false);
      console.error("Order submission error:", error);
      toast.error("Failed to submit order. Please try again.");
    }
  };
  if (!order) {
    return <div className="page-container text-center py-20">
        <div className="animate-spin mb-4">
          <div className="w-8 h-8 border-4 border-organic-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
        <p>Loading order details...</p>
      </div>;
  }
  return <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        {isOrderComplete ? <motion.div className="max-w-md mx-auto text-center py-12" initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5
      }}>
            <div className="w-20 h-20 bg-organic-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check size={40} className="text-organic-600" />
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-organic-800 mb-4">
              Order Placed Successfully!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Thank you for your order. We have received your payment and will process your order shortly.
            </p>
            
            <div className="bg-organic-50 p-6 rounded-lg border border-organic-100 mb-8">
              <h3 className="font-bold text-organic-800 mb-4">Order Summary</h3>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{order.productName}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold">₹{order.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-organic-600 font-medium">Completed</span>
              </div>
            </div>
            
            <button onClick={() => navigate("/produce")} className="btn-primary">
              Continue Shopping
            </button>
          </motion.div> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-6">
                Complete Your Payment
              </h2>
              
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium">{order.productName}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span>{order.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per unit:</span>
                    <span>₹{(order.totalPrice / order.quantity).toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between font-bold">
                      <span>Total Amount:</span>
                      <span className="text-organic-700">₹{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-2">Delivery Details</h4>
                  
                  <div className="text-gray-600">
                    <p className="mb-1"><span className="font-medium">Name:</span> {order.customerDetails.name}</p>
                    <p className="mb-1"><span className="font-medium">Phone:</span> {order.customerDetails.phone}</p>
                    <p><span className="font-medium">Address:</span> {order.customerDetails.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-organic-50 p-6 rounded-xl border border-organic-100">
                <div className="flex items-start mb-4">
                  <QrCode size={24} className="text-organic-700 mt-1 mr-3" />
                  <div>
                    <h3 className="font-bold text-organic-800 mb-1">Scan the QR Code to Pay</h3>
                    <p className="text-gray-600 text-sm">
                      Use any UPI app to scan this QR code and make your payment.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center my-6">
                  <img 
                    alt="Payment QR Code" 
                    className="w-64 h-auto object-contain" 
                    src="/lovable-uploads/6ac79cb8-c790-4fa1-9216-484390894fe3.png" 
                  />
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    THE MAJKUVA ORGANIC KHEDUT
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    UPI ID: yespay.kdcska2410525@yesbankltd
                  </p>
                  <p className="text-sm text-gray-600">
                    After payment, please enter your transaction ID and upload a screenshot of the payment confirmation.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{
          opacity: 0,
          x: 30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-6">
                Confirm Payment
              </h2>
              
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="mb-6">
                  <label htmlFor="transactionId" className="block text-gray-700 font-medium mb-2">
                    Transaction ID / Reference Number *
                  </label>
                  <input type="text" id="transactionId" value={transactionId} onChange={e => setTransactionId(e.target.value)} required className="input-field" placeholder="Enter your transaction ID" />
                  <p className="text-gray-500 text-sm mt-1">
                    This can be found in your UPI app after making the payment.
                  </p>
                </div>
                
                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-2">
                    Upload Payment Screenshot *
                  </label>
                  
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  
                  {filePreview ? <div className="mb-4">
                      <div className="relative">
                        <img src={filePreview} alt="Payment Screenshot" className="max-h-64 mx-auto border border-gray-200 rounded-lg object-contain" />
                        <button type="button" onClick={() => {
                    setSelectedFile(null);
                    setFilePreview(null);
                  }} className="absolute top-2 right-2 w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                          &times;
                        </button>
                      </div>
                    </div> : <div onClick={handleUploadClick} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-1">Click to upload payment screenshot</p>
                      <p className="text-gray-500 text-sm">
                        Supports JPG, PNG, JPEG (Max 5MB)
                      </p>
                    </div>}
                </div>
                
                <button type="submit" disabled={isUploading} className="btn-primary w-full flex items-center justify-center space-x-2">
                  {isUploading ? <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </> : <>
                      <Check size={18} />
                      <span>Confirm Order</span>
                    </>}
                </button>
              </form>
              
              <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> Please ensure that you have made the payment before confirming your order. You will receive a confirmation once your order is processed.
                </p>
              </div>
            </motion.div>
          </div>}
      </div>
    </div>;
};
export default OrderConfirmation;
