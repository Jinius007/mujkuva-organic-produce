// Test Supabase connection and table access
import { supabase } from './integrations/supabase/client';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data: testData, error: testError } = await supabase
      .from('order_slots')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Basic connection failed:', testError);
      return false;
    }
    console.log('✅ Basic connection successful');
    
    // Test 2: Storage bucket access
    console.log('2. Testing storage bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Storage bucket access failed:', bucketError);
      return false;
    }
    
    const paymentBucket = buckets.find(b => b.id === 'payment_screenshots');
    if (!paymentBucket) {
      console.error('❌ payment_screenshots bucket not found');
      return false;
    }
    
    console.log('✅ Storage bucket access successful');
    console.log('   - payment_screenshots bucket found');
    console.log('   - Bucket public:', paymentBucket.public);
    console.log('   - File size limit:', paymentBucket.file_size_limit);
    
    // Test 3: Table schema
    console.log('3. Testing table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('order_slots')
      .select('*')
      .limit(0);
    
    if (schemaError) {
      console.error('❌ Table schema test failed:', schemaError);
      return false;
    }
    console.log('✅ Table schema test successful');
    
    // Test 4: Test file upload (small test file)
    console.log('4. Testing file upload capability...');
    const testBlob = new Blob(['test content'], { type: 'text/plain' });
    const testFileName = `test_${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('payment_screenshots')
      .upload(testFileName, testBlob);
    
    if (uploadError) {
      console.error('❌ File upload test failed:', uploadError);
      console.error('   - Error message:', uploadError.message);
      console.error('   - Error details:', uploadError);
      return false;
    }
    
    console.log('✅ File upload test successful:', uploadData);
    
    // Test 5: Test database insert
    console.log('5. Testing database insert capability...');
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
      console.error('❌ Database insert test failed:', insertError);
      console.error('   - Error code:', insertError.code);
      console.error('   - Error message:', insertError.message);
      console.error('   - Error details:', insertError);
      console.error('   - Error hint:', insertError.hint);
      return false;
    }
    
    console.log('✅ Database insert test successful:', insertData);
    
    // Clean up test data
    console.log('6. Cleaning up test data...');
    await supabase.storage.from('payment_screenshots').remove([testFileName]);
    await supabase.from('order_slots').delete().eq('id', insertData[0].id);
    console.log('✅ Test data cleaned up');
    
    console.log('🎉 All Supabase tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Supabase test failed with exception:', error);
    return false;
  }
}

// Export for use in components
export default testSupabaseConnection; 