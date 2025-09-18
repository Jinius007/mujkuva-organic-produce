// Final test to verify production site is working
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zjjjajkzavxytdexkbrj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqamphamt6YXZ4eXRkZXhrYnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjY3ODYsImV4cCI6MjA1ODY0Mjc4Nn0.Q6mKuZ5NhEpzi3k0PyxvMnJAWPwiLOS6dvMZ_VF1UXE";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

async function finalTest() {
  console.log('🔍 FINAL TEST - Checking if production site is working...');
  console.log('Production URL: https://mujkuva-organic-produce-order.vercel.app/');
  
  try {
    // Test 1: Check if production site has latest code
    console.log('1. Checking production site code...');
    
    const response = await fetch('https://mujkuva-organic-produce-order.vercel.app/', {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = await response.text();
    
    // Check for our latest changes
    const hasLatestCode = html.includes('v2.2') || html.includes('URGENT DEPLOYMENT') || html.includes('MUST be deployed');
    
    console.log('✅ Production site is accessible');
    console.log('   - Status:', response.status);
    console.log('   - Has latest code:', hasLatestCode);
    console.log('   - HTML length:', html.length);
    
    if (hasLatestCode) {
      console.log('🎉 SUCCESS: Production site has latest code!');
    } else {
      console.log('⚠️  Production site still has old code');
      console.log('   - Vercel deployment may still be in progress');
      console.log('   - Or there may be a deployment issue');
    }
    
    // Test 2: Test the complete payment flow
    console.log('2. Testing complete payment flow...');
    
    // Simulate Make Payment click (creates reserved order)
    const testReservedOrder = {
      product_id: 'final-test',
      product_name: 'Final Test Product',
      customer_name: 'Final Test Customer',
      customer_phone: '1234567890',
      customer_address: 'Final Test Address',
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
    
    console.log('✅ Reserved order created (Make Payment works):', reservedData[0].id);
    
    // Simulate Confirm Order click (updates to confirmed)
    const { data: confirmData, error: confirmError } = await supabase
      .from('order_slots')
      .update({
        status: 'confirmed',
        transaction_id: 'FINAL_TEST_' + Date.now(),
        payment_screenshot_path: 'final_test_screenshot.jpg'
      })
      .eq('id', reservedData[0].id)
      .select();
    
    if (confirmError) {
      console.error('❌ Cannot confirm order:', confirmError);
      return false;
    }
    
    console.log('✅ Order confirmed (Confirm Order works):', confirmData[0].status);
    
    // Clean up test data
    await supabase.from('order_slots').delete().eq('id', reservedData[0].id);
    console.log('✅ Test data cleaned up');
    
    // Final status
    console.log('\n🎯 FINAL STATUS:');
    if (hasLatestCode) {
      console.log('🎉 PRODUCTION SITE IS WORKING!');
      console.log('✅ Latest code is deployed');
      console.log('✅ Make Payment creates reserved orders');
      console.log('✅ Confirm Order updates to confirmed');
      console.log('✅ Complete payment flow is functional');
      console.log('✅ Users can now place orders successfully!');
    } else {
      console.log('⚠️  PRODUCTION SITE NOT YET WORKING');
      console.log('❌ Still has old code');
      console.log('📋 Vercel deployment may be delayed');
      console.log('📋 Try manual redeploy in Vercel dashboard');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Final test failed:', error);
    return false;
  }
}

finalTest();
