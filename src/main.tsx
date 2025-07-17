import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import StripePaymentGatewayProvider from './components/paymentGateway/StripePaymentGateway'
import ErrorBoundary from './utils/error-boundary/ErrorBoundary.tsx'
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <Provider store={store}>
           <PersistGate persistor={persistor}>
             <GoogleOAuthProvider clientId={clientId}>
              <StripePaymentGatewayProvider>
                  <QueryClientProvider client={queryClient}>
                    <ErrorBoundary>
                  
                    <App />
                   </ErrorBoundary>
                 </QueryClientProvider>
              </StripePaymentGatewayProvider>
            </GoogleOAuthProvider> 
           </PersistGate>
        </Provider>
  </StrictMode>,
)
