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
  reservationIds?: string[]; // Added for existing reservations
}

const Checkout = () => {
  const navigate = useNavigate();
  const { clearCart, state: cartState } = useCart();
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
    console.log('📦 Loading checkout data from sessionStorage...');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('✅ Checkout data loaded:', parsed);
        console.log('   Reservation IDs:', parsed.reservationIds);
        setCheckoutData(parsed);
      } catch (e) {
        console.error('❌ Failed to parse checkout data:', e);
        setCheckoutData(null);
      }
    } else {
      console.warn('⚠️ No checkout data found in sessionStorage');
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
      console.log('Starting order submission...');
      console.log('Checkout data:', effectiveCheckoutData);
      console.log('Cart state:', cartState);
      console.log('Transaction ID:', transactionId);
      console.log('Selected file:', selectedFile);

      // Upload payment screenshot with fallback handling
      let fileName = null;
      let uploadError = null;
      
      try {
        fileName = `payment_${Date.now()}_${selectedFile.name}`;
        console.log('Attempting to upload file:', fileName);
        
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('new_payment_proofs')
          .upload(fileName, selectedFile);

        if (uploadErr) {
          console.error('Upload error:', uploadErr);
          uploadError = uploadErr;
          // Don't throw error - continue with fallback
        } else {
          console.log('File uploaded successfully:', uploadData);
        }
      } catch (uploadException) {
        console.error('Upload exception:', uploadException);
        uploadError = uploadException;
        // Don't throw error - continue with fallback
      }

      // If upload failed, use a fallback filename
      if (uploadError) {
        console.warn('File upload failed, using fallback filename');
        fileName = `payment_${Date.now()}_fallback.jpg`;
        toast.warning('Payment screenshot upload failed, but order will still be processed. Please contact support if needed.');
      }

      // Update existing RESERVED orders to CONFIRMED status
      if (effectiveCheckoutData.reservationIds && effectiveCheckoutData.reservationIds.length > 0) {
        console.log('🔄 Updating existing RESERVED orders to CONFIRMED...');
        console.log('📋 Reservation IDs:', effectiveCheckoutData.reservationIds);
        
        const updatePromises = effectiveCheckoutData.reservationIds.map(async (reservationId) => {
          if (!reservationId) {
            console.error('❌ Invalid reservation ID:', reservationId);
            return { error: { message: 'Invalid reservation ID' }, data: null };
          }

          const updateData = {
            status: 'confirmed',
            transaction_id: transactionId,
            payment_screenshot_path: fileName
          };

          console.log(`📝 Updating reservation ${reservationId} to confirmed:`, updateData);
          const result = await supabase
            .from('order_slots')
            .update(updateData)
            .eq('id', reservationId)
            .select();

          if (result.error) {
            console.error(`❌ Failed to update reservation ${reservationId}:`, result.error);
            console.error('   Error code:', result.error.code);
            console.error('   Error message:', result.error.message);
            console.error('   Error details:', result.error.details);
            console.error('   Error hint:', result.error.hint);
          } else {
            console.log(`✅ Successfully updated reservation ${reservationId}:`, result.data);
          }

          return result;
        });

        // Update all reservation records
        const updateResults = await Promise.all(updatePromises);
        
        // Check for any errors
        const errors = updateResults.filter(result => result.error);
        const successes = updateResults.filter(result => !result.error && result.data && result.data.length > 0);
        
        if (errors.length > 0) {
          console.error('❌ Some orders failed to update:', errors);
          errors.forEach((error, index) => {
            console.error(`   Error ${index + 1}:`, error.error);
          });
          toast.error(`${errors.length} order(s) failed to update. Please check console for details and contact support.`);
        }

        if (successes.length > 0) {
          console.log(`✅ ${successes.length} order(s) updated successfully:`, successes.map(r => r.data));
        }

        if (errors.length === updateResults.length) {
          // All updates failed - this is critical
          console.error('❌ CRITICAL: All order updates failed!');
          toast.error('Failed to confirm orders. Please contact support immediately.');
          setIsUploading(false);
          return;
        }

        // Verify the updates were successful by querying the database
        console.log('🔍 Verifying order updates...');
        const verifyPromises = effectiveCheckoutData.reservationIds.map(async (reservationId) => {
          const { data, error } = await supabase
            .from('order_slots')
            .select('id, status, transaction_id, payment_screenshot_path')
            .eq('id', reservationId)
            .single();
          
          if (error) {
            console.error(`❌ Verification failed for ${reservationId}:`, error);
            return null;
          }
          
          console.log(`✅ Verified order ${reservationId}:`, data);
          return data;
        });

        const verifiedOrders = await Promise.all(verifyPromises);
        const confirmedOrders = verifiedOrders.filter(order => order && order.status === 'confirmed');
        console.log(`✅ Verification complete: ${confirmedOrders.length}/${effectiveCheckoutData.reservationIds.length} orders confirmed`);
      } else {
        // Fallback: Create new orders if no reservation IDs (shouldn't happen in normal flow)
        console.warn('⚠️ No reservation IDs found, creating new orders as fallback...');
        console.warn('   Checkout data:', effectiveCheckoutData);
        console.warn('   Reservation IDs:', effectiveCheckoutData.reservationIds);
        
        const orderPromises = effectiveCheckoutData.items.map(async (item) => {
          const orderId = uuidv4();
          const orderData = {
            id: orderId,
            product_id: item.id,
            product_name: item.name,
            customer_name: (effectiveCheckoutData.customerDetails?.name || '').trim(),
            customer_phone: (effectiveCheckoutData.customerDetails?.phone || '').trim(),
            customer_address: (effectiveCheckoutData.customerDetails?.address || '').trim(),
            quantity: parseFloat(item.quantity.toFixed(2)), // Ensure proper numeric format
            weight_kg: parseFloat(item.quantity.toFixed(2)), // Ensure proper numeric format
            total_price: parseFloat((item.price * item.quantity).toFixed(2)), // Ensure proper numeric format
            order_date: new Date().toISOString().split('T')[0],
            status: 'confirmed',
            transaction_id: transactionId,
            payment_screenshot_path: fileName
          };

          console.log(`📝 Creating fallback order for ${item.name}:`, orderData);
          const result = await supabase.from('order_slots').insert(orderData).select();
          
          if (result.error) {
            console.error(`❌ Failed to create fallback order for ${item.name}:`, result.error);
            console.error('   Error code:', result.error.code);
            console.error('   Error message:', result.error.message);
            console.error('   Error details:', result.error.details);
            console.error('   Error hint:', result.error.hint);
            
            if (result.error.message?.includes('integer') || result.error.message?.includes('type')) {
              console.error('   ⚠️  LIKELY ISSUE: quantity field is still INTEGER type!');
              console.error('   SOLUTION: Run the fix script: supabase/fix-order-slots-complete.sql');
            }
          } else {
            console.log(`✅ Successfully created fallback order for ${item.name}:`, result.data);
          }
          
          return result;
        });

        const orderResults = await Promise.all(orderPromises);
        const errors = orderResults.filter(result => result.error);
        const successes = orderResults.filter(result => !result.error && result.data && result.data.length > 0);
        
        if (errors.length > 0) {
          console.error('❌ Some fallback orders failed to insert:', errors);
          errors.forEach((error, index) => {
            console.error(`   Error ${index + 1}:`, error.error);
          });
          toast.error(`${errors.length} order(s) failed to create. Please check console for details.`);
          
          if (errors.length === orderResults.length) {
            // All inserts failed - critical error
            console.error('❌ CRITICAL: All fallback orders failed to insert!');
            toast.error('Failed to create orders. Please contact support immediately.');
            setIsUploading(false);
            return;
          }
        }
        
        if (successes.length > 0) {
          console.log(`✅ ${successes.length} fallback order(s) created successfully`);
        }
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

  // Use cart data directly and validate before allowing checkout
  let effectiveCheckoutData: CheckoutData;
  if (checkoutData && checkoutData.items && checkoutData.items.length > 0) {
    console.log('✅ Using checkout data from sessionStorage');
    console.log('   Items:', checkoutData.items.length);
    console.log('   Reservation IDs:', checkoutData.reservationIds);
    effectiveCheckoutData = checkoutData;
  } else if (cartState.items && cartState.items.length > 0) {
    // Use cart data if no checkout data but cart has items
    console.warn('⚠️ No checkout data found, using cart state (reservation IDs will be missing)');
    effectiveCheckoutData = {
      items: cartState.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cartState.total,
      customerDetails: { name: '', phone: '', address: '' },
      reservationIds: [] // No reservation IDs available
    };
  } else {
    // No items available - redirect to produce page
    toast.error('No items in cart. Please add items before checkout.');
    navigate('/produce');
    return null;
  }
  
  // Log effective checkout data before submission
  console.log('📋 Effective checkout data before submission:', {
    items: effectiveCheckoutData.items.length,
    reservationIds: effectiveCheckoutData.reservationIds?.length || 0,
    hasReservationIds: !!(effectiveCheckoutData.reservationIds && effectiveCheckoutData.reservationIds.length > 0)
  });

  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
            <p className="text-gray-600">Complete your order with payment</p>
            
          </div>
          
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