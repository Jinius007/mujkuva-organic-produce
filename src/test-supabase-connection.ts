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
    
    console.log('🎉 All Supabase tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Supabase test failed with exception:', error);
    return false;
  }
}

// Export for use in components
export default testSupabaseConnection; 