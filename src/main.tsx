import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import AuthProvider from './components/AuthProvider';
import App from './App';
import 'antd/dist/antd.less';
import './antd_override.less';
import './index.css';
import Loading from './components/Loading';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});
ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <App />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById('root')
);
