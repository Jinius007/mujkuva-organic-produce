
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './hideBadge.css'
import { testPaymentFlow } from './test-payment-flow'

// Make test function available in development
if (import.meta.env.DEV) {
  (window as any).testPaymentFlow = testPaymentFlow;
}

createRoot(document.getElementById("root")!).render(<App />);
