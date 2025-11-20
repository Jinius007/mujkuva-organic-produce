
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './hideBadge.css'
import { testPaymentFlow } from './test-payment-flow'
import { testOrderSlots } from './test-order-slots'

// Make test functions available in development
if (import.meta.env.DEV) {
  (window as any).testPaymentFlow = testPaymentFlow;
  (window as any).testOrderSlots = testOrderSlots;
  console.log('🧪 Test functions available:');
  console.log('   - testOrderSlots() - Test order_slots table');
  console.log('   - testPaymentFlow() - Test payment flow');
}

createRoot(document.getElementById("root")!).render(<App />);
