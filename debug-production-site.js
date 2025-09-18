// Debug the production site to find what's broken
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zjjjajkzavxytdexkbrj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqamphamt6YXZ4eXRkZXhrYnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjY3ODYsImV4cCI6MjA1ODY0Mjc4Nn0.Q6mKuZ5NhEpzi3k0PyxvMnJAWPwiLOS6dvMZ_VF1UXE";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function debugProductionSite() {
  console.log('🔍 DEBUGGING PRODUCTION SITE...');
  console.log('Production URL: https://mujkuva-organic-produce-order.vercel.app/');
  
  try {
    // Test 1: Check if the production site is serving the latest code
    console.log('1. Checking production site code...');
    
    const response = await fetch('https://mujkuva-organic-produce-order.vercel.app/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    
    // Check if the HTML contains our recent changes
    const hasRecentChanges = html.includes('reserved') || html.includes('Make Payment');
    
    console.log('✅ Production site is accessible');
    console.log('   - Status:', response.status);
    console.log('   - Has recent changes:', hasRecentChanges);
    console.log('   - HTML length:', html.length);
    
    // Test 2: Check storage bucket access
    console.log('2. Testing storage bucket access...');
    
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Storage access failed:', bucketError);
    } else {
      console.log('Available buckets:', buckets.map(b => b.id));
      
      const hasPaymentBucket = buckets.some(b => b.id === 'new_payment_proofs');
      console.log('Has payment bucket:', hasPaymentBucket);
      
      if (!hasPaymentBucket) {
        console.error('❌ CRITICAL: new_payment_proofs bucket is missing!');
        console.error('   This is why payment uploads are failing!');
      }
    }
    
    // Test 3: Check recent orders and their status
    console.log('3. Analyzing recent orders...');
    
    const { data: recentOrders, error: orderError } = await supabase
      .from('order_slots')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (orderError) {
      console.error('❌ Cannot fetch orders:', orderError);
      return false;
    }
    
    console.log('Recent orders analysis:');
    const statusCounts = {};
    recentOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });
    
    console.log('Status distribution:', statusCounts);
    
    // Check for stuck reserved orders
    const reservedOrders = recentOrders.filter(o => o.status === 'reserved');
    if (reservedOrders.length > 0) {
      console.log('⚠️  Found reserved orders that might be stuck:');
      reservedOrders.forEach(order => {
        const ageMinutes = Math.round((Date.now() - new Date(order.created_at).getTime()) / (1000 * 60));
        console.log(`   - ${order.customer_name}: ${order.product_name} (${ageMinutes} minutes ago)`);
      });
    }
    
    // Test 4: Test the complete order flow
    console.log('4. Testing complete order flow...');
    
    // Step 1: Create a reserved order (like when user clicks "Make Payment")
    const testReservedOrder = {
      product_id: 'debug-test',
      product_name: 'Debug Test Product',
      customer_name: 'Debug Test Customer',
      customer_phone: '1234567890',
      customer_address: 'Debug Test Address',
      quantity: 1,
      weight_kg: 1.0,
      total_price: 100.0,
      order_date: new Date().toISOString().split('T')[0],
      status: 'reserved',
      transaction_id: null,
      payment_screenshot_path: null
    };
    
    const { data: reservedData, error: reservedError } = await supabase
      .from('order_slots')
      .insert(testReservedOrder)
      .select();
    
    if (reservedError) {
      console.error('❌ Cannot create reserved order:', reservedError);
      return false;
    }
    
    console.log('✅ Reserved order created:', reservedData[0].id);
    
    // Step 2: Try to upload a test file (simulating payment screenshot)
    console.log('5. Testing file upload...');
    
    const testBlob = new Blob(['test payment screenshot'], { type: 'image/jpeg' });
    const testFileName = `debug_test_${Date.now()}.jpg`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('new_payment_proofs')
      .upload(testFileName, testBlob);
    
    if (uploadError) {
      console.error('❌ File upload failed:', uploadError);
      console.error('   - This is why payment confirmation fails!');
      console.error('   - Error code:', uploadError.status);
      console.error('   - Error message:', uploadError.message);
    } else {
      console.log('✅ File upload successful:', uploadData);
    }
    
    // Step 3: Update reserved order to confirmed (if upload worked)
    if (!uploadError) {
      console.log('6. Testing order confirmation...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('order_slots')
        .update({
          status: 'confirmed',
          transaction_id: 'DEBUG_TEST_' + Date.now(),
          payment_screenshot_path: testFileName
        })
        .eq('id', reservedData[0].id)
        .select();
      
      if (updateError) {
        console.error('❌ Cannot confirm order:', updateError);
      } else {
        console.log('✅ Order confirmed successfully');
      }
    }
    
    // Clean up test data
    console.log('7. Cleaning up test data...');
    await supabase.from('order_slots').delete().eq('id', reservedData[0].id);
    if (!uploadError) {
      await supabase.storage.from('new_payment_proofs').remove([testFileName]);
    }
    console.log('✅ Test data cleaned up');
    
    // Final diagnosis
    console.log('\n🎯 FINAL DIAGNOSIS:');
    if (uploadError) {
      console.log('❌ MAIN ISSUE: Storage bucket upload is failing');
      console.log('   📋 SOLUTION: Run the storage bucket setup script in Supabase');
      console.log('   🔧 The script is in: supabase/create-new-storage-bucket.sql');
    } else {
      console.log('✅ All systems working - issue might be elsewhere');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    return false;
  }
}

debugProductionSite();
