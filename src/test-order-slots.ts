import { supabase } from '@/integrations/supabase/client';

/**
 * Comprehensive test for order_slots table functionality
 * Run this in browser console: testOrderSlots()
 */
export async function testOrderSlots() {
  console.log('🧪 Testing order_slots table functionality...\n');

  try {
    // Test 1: Check table exists and structure
    console.log('1️⃣ Testing table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('order_slots')
      .select('*')
      .limit(0);

    if (tableError) {
      console.error('❌ Table access failed:', tableError);
      console.error('   Error code:', tableError.code);
      console.error('   Error message:', tableError.message);
      return false;
    }
    console.log('✅ Table exists and is accessible');

    // Test 2: Check quantity field type by attempting insert with decimal
    console.log('\n2️⃣ Testing quantity field (decimal support)...');
    const testOrderId = crypto.randomUUID();
    const testOrderData = {
      id: testOrderId,
      product_id: 'test-product',
      product_name: 'Test Product',
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_address: 'Test Address',
      quantity: 0.25, // Decimal value - this should work if field is NUMERIC
      weight_kg: 0.25,
      total_price: 25.0,
      order_date: new Date().toISOString().split('T')[0],
      status: 'test',
      transaction_id: null,
      payment_screenshot_path: null
    };

    console.log('   Attempting to insert test order with decimal quantity (0.25)...');
    const { data: insertData, error: insertError } = await supabase
      .from('order_slots')
      .insert(testOrderData)
      .select();

    if (insertError) {
      console.error('❌ Insert failed:', insertError);
      console.error('   Error code:', insertError.code);
      console.error('   Error message:', insertError.message);
      console.error('   Error details:', insertError.details);
      console.error('   Error hint:', insertError.hint);
      
      if (insertError.message?.includes('integer') || insertError.message?.includes('type')) {
        console.error('\n⚠️  LIKELY ISSUE: quantity field is still INTEGER type!');
        console.error('   SOLUTION: Run the fix script: supabase/fix-order-slots-complete.sql');
      }
      return false;
    }

    if (!insertData || insertData.length === 0) {
      console.error('❌ Insert returned no data');
      return false;
    }

    console.log('✅ Insert successful with decimal quantity!');
    console.log('   Inserted order:', insertData[0]);

    // Test 3: Verify the inserted data
    console.log('\n3️⃣ Verifying inserted data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('order_slots')
      .select('*')
      .eq('id', testOrderId)
      .single();

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError);
      return false;
    }

    if (!verifyData) {
      console.error('❌ No data found for inserted order');
      return false;
    }

    console.log('✅ Data verified:', verifyData);
    console.log('   Quantity:', verifyData.quantity, '(type:', typeof verifyData.quantity, ')');
    console.log('   Weight:', verifyData.weight_kg);
    console.log('   Status:', verifyData.status);

    // Test 4: Test update functionality
    console.log('\n4️⃣ Testing update functionality...');
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
      console.error('❌ Update failed:', updateError);
      return false;
    }

    console.log('✅ Update successful:', updateData[0]);

    // Test 5: Test with different decimal quantities
    console.log('\n5️⃣ Testing various decimal quantities...');
    const testQuantities = [0.25, 0.5, 1.0, 1.5, 2.25];
    let allPassed = true;

    for (const qty of testQuantities) {
      const testId = crypto.randomUUID();
      const { error: qtyError } = await supabase
        .from('order_slots')
        .insert({
          id: testId,
          product_id: 'test-qty',
          product_name: 'Test Qty Product',
          customer_name: 'Test Customer',
          customer_phone: '1234567890',
          customer_address: 'Test Address',
          quantity: qty,
          weight_kg: qty,
          total_price: qty * 100,
          order_date: new Date().toISOString().split('T')[0],
          status: 'test'
        });

      if (qtyError) {
        console.error(`❌ Failed to insert quantity ${qty}:`, qtyError.message);
        allPassed = false;
      } else {
        console.log(`✅ Quantity ${qty} inserted successfully`);
        // Clean up
        await supabase.from('order_slots').delete().eq('id', testId);
      }
    }

    if (!allPassed) {
      console.error('❌ Some quantity tests failed');
      return false;
    }

    // Test 6: Clean up test data
    console.log('\n6️⃣ Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('order_slots')
      .delete()
      .eq('id', testOrderId);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError);
      // Don't return false - cleanup failure is not critical
    } else {
      console.log('✅ Test data cleaned up');
    }

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED!');
    console.log('='.repeat(50));
    console.log('\n✅ order_slots table is working correctly');
    console.log('✅ Decimal quantities are supported');
    console.log('✅ Insert, Update, and Select operations work');
    console.log('\nYou can now place orders through the website!');

    return true;

  } catch (error) {
    console.error('❌ Test failed with exception:', error);
    return false;
  }
}

// Make it available in browser console
if (typeof window !== 'undefined') {
  (window as any).testOrderSlots = testOrderSlots;
  console.log('💡 Database Test Available!');
  console.log('   Run: testOrderSlots() in console to test order_slots table');
}

