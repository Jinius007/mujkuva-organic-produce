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

  // Restore proper payment functionality
  const handleOrderSubmit = async () => {
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload a payment screenshot');
      return;
    }

    setIsUploading(true);

    try {
      // Upload payment screenshot
      const fileName = `payment_${Date.now()}_${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Create order record
      const orderId = uuidv4();
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          items: effectiveCheckoutData.items,
          total: effectiveCheckoutData.total,
          transaction_id: transactionId,
          payment_screenshot: fileName,
          status: 'confirmed',
          created_at: new Date().toISOString()
        });

      if (orderError) {
        throw orderError;
      }

      // Clear cart and show success
      clearCart();
      setIsOrderComplete(true);
      toast.success('Order placed successfully!');

      // Redirect to order confirmation
      setTimeout(() => {
        navigate('/order-confirmation');
      }, 2000);

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Always show checkout/payment UI for local testing (even if no checkoutData)
  // Use dummy data for UI
  let effectiveCheckoutData: CheckoutData;
  if (checkoutData && checkoutData.items && checkoutData.items.length > 0) {
    effectiveCheckoutData = checkoutData;
  } else {
    // Allow upload even if cart is not present
    effectiveCheckoutData = {
      items: [],
      total: 0,
      customerDetails: { name: '', phone: '', address: '' }
    };
  }
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
              <div className="flex flex-col items-center gap-2 mt-4">
                <button
                  className="btn-primary"
                  style={{ width: 'fit-content' }}
                  onClick={() => {
                    navigator.clipboard.writeText('yespay.kdcskai2410525@yesbankltd');
                    toast.success('UPI ID copied to clipboard!');
                  }}
                >
                  Copy UPI ID
                </button>

                <button
                  className="btn-primary"
                  style={{ width: 'fit-content' }}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/lovable-uploads/kdcc-qr.png';
                    link.download = 'mujkuva-upi-qr.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download QR Code
                </button>
              </div>
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