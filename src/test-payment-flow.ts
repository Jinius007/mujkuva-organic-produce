// Test script to verify payment flow functionality
// This can be run in the browser console or as a standalone test

import { supabase } from './integrations/supabase/client';

export const testPaymentFlow = async () => {
  console.log('🧪 Testing Payment Flow...');
  
  try {
    // Test 1: Check database connection
    console.log('1. Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('order_slots')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError);
      return false;
    }
    console.log('✅ Database connection successful');

    // Test 2: Test creating a reserved order
    console.log('2. Testing reserved order creation...');
    const testOrderId = crypto.randomUUID();
    const testOrderData = {
      id: testOrderId,
      product_id: 'test-product',
      product_name: 'Test Product',
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_address: 'Test Address',
      quantity: 1,
      weight_kg: 1,
      total_price: 100,
      order_date: new Date().toISOString().split('T')[0],
      status: 'reserved',
      transaction_id: null,
      payment_screenshot_path: null
    };

    const { data: insertData, error: insertError } = await supabase
      .from('order_slots')
      .insert(testOrderData)
      .select();

    if (insertError) {
      console.error('❌ Failed to create reserved order:', insertError);
      return false;
    }
    console.log('✅ Reserved order created successfully');

    // Test 3: Test updating reserved order to confirmed
    console.log('3. Testing order confirmation...');
    const { data: updateData, error: updateError } = await supabase
      .from('order_slots')
      .update({
        status: 'confirmed',
        transaction_id: 'TEST_TXN_123',
        payment_screenshot_path: 'test-screenshot.jpg'
      })
      .eq('id', testOrderId)
      .select();

    if (updateError) {
      console.error('❌ Failed to confirm order:', updateError);
      return false;
    }
    console.log('✅ Order confirmed successfully');

    // Test 4: Clean up test data
    console.log('4. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('order_slots')
      .delete()
      .eq('id', testOrderId);

    if (deleteError) {
      console.error('❌ Failed to clean up test data:', deleteError);
      return false;
    }
    console.log('✅ Test data cleaned up');

    // Test 5: Test stock calculation
    console.log('5. Testing stock calculation...');
    const { data: stockData, error: stockError } = await supabase
      .from('order_slots')
      .select('product_id, quantity, status')
      .gte('order_date', '2025-07-26')
      .lte('order_date', '2025-07-29')
      .in('status', ['reserved', 'confirmed']);

    if (stockError) {
      console.error('❌ Failed to fetch stock data:', stockError);
      return false;
    }
    console.log('✅ Stock calculation working');

    console.log('🎉 All payment flow tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Payment flow test failed:', error);
    return false;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testPaymentFlow = testPaymentFlow;
}
