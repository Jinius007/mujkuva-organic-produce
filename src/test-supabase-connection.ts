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
      console.error('   - Error code:', testError.code);
      console.error('   - Error message:', testError.message);
      
      // Check if it's a table doesn't exist error
      if (testError.code === '42P01') {
        console.error('   - ISSUE: Table "order_slots" does not exist!');
        console.error('   - SOLUTION: Run the migrations on your Supabase backend');
      }
      return false;
    }
    console.log('✅ Basic connection successful');
    
    // Test 2: Storage bucket access
    console.log('2. Testing storage bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Storage bucket access failed:', bucketError);
      console.error('   - Error message:', bucketError.message);
      return false;
    }
    
    console.log('Available buckets:', buckets.map(b => ({ id: b.id, name: b.name, public: b.public })));
    
    const paymentBucket = buckets.find(b => b.id === 'payment_screenshots');
    if (!paymentBucket) {
      console.error('❌ payment_screenshots bucket not found');
      console.error('   - SOLUTION: Run the storage bucket migration on your Supabase backend');
      return false;
    }
    
    console.log('✅ Storage bucket access successful');
    console.log('   - payment_screenshots bucket found');
    console.log('   - Bucket public:', paymentBucket.public);
    
    console.log('🎉 All Supabase tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Supabase test failed with exception:', error);
    return false;
  }
}

// Export for use in components
export default testSupabaseConnection; 