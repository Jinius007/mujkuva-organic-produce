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
    console.log('Stored checkout data:', storedData);
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log('Parsed checkout data:', data);
        setCheckoutData(data);
      } catch (error) {
        console.error('Error parsing checkout data:', error);
        navigate('/cart');
        toast.error('Invalid checkout data found.');
      }
    } else {
      console.log('No checkout data found in sessionStorage');
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
      console.log('Starting order submission...', { checkoutData, transactionId });
      
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      
      console.log('Uploading file to storage:', fileName);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment_screenshots')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('File upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully:', uploadData);

      // Update existing orders with payment information
      console.log('Updating orders with payment information...');
      
      const updatePromises = checkoutData.items.map(item => {
        const updateData = {
          transaction_id: transactionId,
          payment_screenshot_path: uploadData?.path || null,
          status: 'confirmed' // Update status to confirmed after payment
        };
        
        console.log('Updating order for item:', item.name, updateData);
        return supabase
          .from('order_slots')
          .update(updateData)
          .eq('product_id', item.id)
          .eq('customer_name', checkoutData.customerDetails.name)
          .eq('customer_phone', checkoutData.customerDetails.phone)
          .eq('status', 'reserved') // Update reserved orders
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Orders from last 24 hours
      });

      const results = await Promise.all(updatePromises);
      
      // Check for errors in any of the update operations
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Database update errors:', errors);
        throw new Error(`Failed to update ${errors.length} orders. Please try again.`);
      }

      // Log successful results for debugging
      console.log('All orders updated successfully:', results);

      // Clear cart and checkout data
      clearCart();
      sessionStorage.removeItem('checkoutData');
      setIsOrderComplete(true);
      toast.success('Order placed successfully!');
      
      // Navigate to order confirmation after 3 seconds
      setTimeout(() => {
        const orderId = Date.now().toString(); // Use timestamp as fallback order ID
        navigate('/order-confirmation', { 
          state: { 
            orderId: orderId,
            orderData: checkoutData 
          } 
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error placing order:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage')) {
          toast.error('Failed to upload payment screenshot. Please try again.');
        } else if (error.message.includes('database') || error.message.includes('order')) {
          toast.error('Failed to save order details. Please try again.');
        } else {
          toast.error(`Order failed: ${error.message}`);
        }
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state while checking checkout data
  if (!checkoutData) {
    return (
      <div className="page-transition pt-24">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <X size={48} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-4">Orders closed for this slot</h2>
          <p className="text-gray-500 mb-8">Ordering is currently unavailable. Please check back later.</p>
          <button
            onClick={() => navigate("/produce")}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  // BLOCK ALL ORDERING: Show orders closed message
  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <X size={48} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-700 mb-4">Orders closed for this slot</h2>
        <p className="text-gray-500 mb-8">Ordering is currently unavailable. Please check back later.</p>
        <button
          onClick={() => navigate("/produce")}
          className="btn-primary"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default Checkout;