import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { queryClient } from './app/queryClient';
import { store } from './app/store';
import './index.css';
import { ToastProvider } from './components/ui/Toast';
import { WakeUpGate } from './components/WakeUpGate';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WakeUpGate>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </QueryClientProvider>
      </Provider>
    </WakeUpGate>
  </StrictMode>,
);