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


  // Restore: Load checkoutData from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('checkoutData');
    if (stored) {
      try {
        setCheckoutData(JSON.parse(stored));
      } catch (e) {
        setCheckoutData(null);
      }
    }
  }, []);

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
    // Use effectiveCheckoutData for local/dev or real checkoutData for prod
    const dataToUse = checkoutData && checkoutData.items && checkoutData.items.length > 0 ? checkoutData : null;
    if (!dataToUse) {
      toast.error('No order data found. Please add items to cart and fill details.');
      return;
    }
    if (!transactionId.trim()) {
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
        setIsUploading(false);
        toast.error('Failed to upload payment screenshot. Please try again.');
        return;
      }
      // Update all reserved orders for this customer with payment info
      const updatePromises = dataToUse.items.map(item => {
        return supabase
          .from('order_slots')
          .update({
            transaction_id: transactionId,
            payment_screenshot_path: uploadData?.path || null,
            status: 'confirmed'
          })
          .eq('product_id', item.id)
          .eq('customer_name', dataToUse.customerDetails.name)
          .eq('customer_phone', dataToUse.customerDetails.phone)
          .eq('status', 'reserved');
      });
      const results = await Promise.all(updatePromises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        setIsUploading(false);
        toast.error('Failed to update some orders. Please try again.');
        return;
      }
      clearCart();
      setIsOrderComplete(true);
      toast.success('Order placed successfully!');
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 2000);
    } catch (error) {
      setIsUploading(false);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Always show checkout/payment UI for local testing (even if no checkoutData)
  // Use dummy data for UI
  const effectiveCheckoutData = checkoutData && checkoutData.items && checkoutData.items.length > 0
    ? checkoutData
    : {
        items: [
          { id: 'test-product', name: 'Test Product', price: 100, quantity: 1 }
        ],
        total: 100,
        customerDetails: { name: 'Test User', phone: '9999999999', address: 'Test Address' }
      };
  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-organic-800">Complete Your Payment</h1>
          <div className="mb-6">
            <p className="mb-2 text-gray-700">Please pay the total amount using the QR code below and upload a screenshot of your payment. Enter your transaction ID to confirm your order.</p>
            <div className="flex flex-col items-center justify-center mb-4">
              <QrCode size={80} className="text-organic-600 mb-2" />
              <img src="/lovable-uploads/kdcc-qr.png" alt="QR Code" className="w-48 h-48 object-contain border rounded-lg" />
              <button
                className="btn-primary mt-4"
                style={{ width: 'fit-content' }}
                onClick={() => {
                  // UPI deep link for supported apps
                  // Example: upi://pay?pa=yourupi@bank&pn=Name&am=amount&cu=INR
                  const upiUrl = `upi://pay?pa=yespay.kdcska2410525@yesbankltd&pn=MAJKUVA%20ORGANIC%20KHEDUT&am=${effectiveCheckoutData.total}&cu=INR`;
                  window.location.href = upiUrl;
                }}
              >
                Pay via UPI App
              </button>
              <span className="text-xs text-gray-500 mt-2">Tap to pay directly using your UPI app</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <label className="font-semibold mb-2">Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                className="input-field w-full max-w-xs"
                placeholder="Enter transaction/reference ID"
                disabled={isUploading || isOrderComplete}
              />
            </div>
            <div className="flex flex-col items-center mb-4">
              <label className="font-semibold mb-2">Upload Payment Screenshot</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading || isOrderComplete}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn-secondary mb-2"
                disabled={isUploading || isOrderComplete}
              >
                <Upload size={18} className="inline mr-2" />
                {selectedFile ? 'Change Screenshot' : 'Upload Screenshot'}
              </button>
              {filePreview && (
                <img src={filePreview} alt="Payment Preview" className="w-40 h-40 object-contain border rounded-lg" />
              )}
            </div>
            <button
              onClick={handleOrderSubmit}
              className="btn-primary w-full flex items-center justify-center"
              disabled={isUploading || isOrderComplete}
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2"><Upload size={18} /></span>
                  Submitting...
                </>
              ) : (
                <>
                  <Check size={18} className="mr-2" />
                  Confirm Payment & Place Order
                </>
              )}
            </button>
            {isOrderComplete && (
              <div className="mt-6 text-green-700 font-semibold text-center">
                Payment received! Redirecting to order confirmation...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;