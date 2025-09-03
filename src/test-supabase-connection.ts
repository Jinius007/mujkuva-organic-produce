// Comprehensive Supabase Diagnostic Test
// This will identify the exact issue since database objects already exist
import { supabase } from './integrations/supabase/client';

export async function testSupabaseConnection() {
  console.log('🔍 Running comprehensive Supabase diagnostic...');
  
  try {
    // Test 1: Basic connectivity
    console.log('1. Testing basic connectivity...');
    const { data: testData, error: testError } = await supabase
      .from('order_slots')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic connectivity failed:', testError);
      console.error('   - Error code:', testError.code);
      console.error('   - Error message:', testError.message);
      
      // Analyze specific error codes
      if (testError.code === '42P01') {
        console.error('   - ISSUE: Table does not exist');
      } else if (testError.code === '42501') {
        console.error('   - ISSUE: Permission denied - RLS policy blocking access');
      } else if (testError.code === '28P01') {
        console.error('   - ISSUE: Authentication failed - invalid API key');
      } else if (testError.code === '3D000') {
        console.error('   - ISSUE: Database does not exist');
      } else if (testError.code === '08001') {
        console.error('   - ISSUE: Connection failed - network/URL issue');
      }
      return false;
    }
    console.log('✅ Basic connectivity successful');
    console.log('   - Data returned:', testData);
    
    // Test 2: Storage bucket access
    console.log('2. Testing storage bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Storage access failed:', bucketError);
      console.error('   - Error message:', bucketError.message);
      return false;
    }
    
    console.log('Available buckets:', buckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
    
    const paymentBucket = buckets.find(b => b.id === 'payment_screenshots');
    if (!paymentBucket) {
      console.error('❌ payment_screenshots bucket not found');
      return false;
    }
    
    console.log('✅ Storage bucket access successful');
    console.log('   - payment_screenshots bucket found');
    console.log('   - Bucket public:', paymentBucket.public);
    
    // Test 3: Test file upload capability
    console.log('3. Testing file upload capability...');
    const testBlob = new Blob(['test content'], { type: 'text/plain' });
    const testFileName = `test_${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment_screenshots')
      .upload(testFileName, testBlob);
    
    if (uploadError) {
      console.error('❌ File upload failed:', uploadError);
      console.error('   - Error message:', uploadError.message);
      console.error('   - This suggests storage RLS policies are blocking uploads');
      return false;
    }
    
    console.log('✅ File upload successful:', uploadData);
    
    // Test 4: Test database insert capability
    console.log('4. Testing database insert capability...');
    const testOrderData = {
      product_id: 'test',
      product_name: 'Test Product',
      customer_name: 'Test Customer',
      customer_phone: '1234567890',
      customer_address: 'Test Address',
      quantity: 1,
      weight_kg: 1.0,
      total_price: 100.0,
      order_date: new Date().toISOString().split('T')[0],
      status: 'test',
      transaction_id: 'test_transaction',
      payment_screenshot_path: testFileName
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('order_slots')
      .insert(testOrderData)
      .select();
    
    if (insertError) {
      console.error('❌ Database insert failed:', insertError);
      console.error('   - Error code:', insertError.code);
      console.error('   - Error message:', insertError.message);
      console.error('   - This suggests table RLS policies are blocking inserts');
      return false;
    }
    
    console.log('✅ Database insert successful:', insertData);
    
    // Clean up test data
    console.log('5. Cleaning up test data...');
    await supabase.storage.from('payment_screenshots').remove([testFileName]);
    await supabase.from('order_slots').delete().eq('id', insertData[0].id);
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 All diagnostic tests passed!');
    console.log('   - Database connectivity: ✅');
    console.log('   - Storage access: ✅');
    console.log('   - File uploads: ✅');
    console.log('   - Data insertion: ✅');
    return true;
    
  } catch (error) {
    console.error('❌ Diagnostic test failed with exception:', error);
    console.error('   - This suggests a network or configuration issue');
    return false;
  }
}

// Export for use in components
export default testSupabaseConnection; 