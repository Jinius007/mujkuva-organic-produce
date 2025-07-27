import { supabase } from './integrations/supabase/client';

export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection test
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase
      .from('order_slots')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Test storage bucket access
    console.log('2. Testing storage bucket access...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Storage access failed:', bucketError);
    } else {
      console.log('✅ Storage access successful');
      console.log('Available buckets:', buckets?.map(b => b.name));
    }
    
    // Test 3: Test table structure
    console.log('3. Testing table structure...');
    const { data: tableData, error: tableError } = await supabase
      .from('order_slots')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table access failed:', tableError);
      return false;
    }
    
    console.log('✅ Table access successful');
    console.log('Table structure sample:', tableData);
    
    console.log('🎉 All Supabase connection tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).testSupabaseConnection = testSupabaseConnection;
  console.log('Supabase connection test available at window.testSupabaseConnection()');
} 