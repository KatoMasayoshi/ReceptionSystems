import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SoundProvider } from './utils/sound'; 


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryclient = new QueryClient();

root.render(
  <React.StrictMode>
    <SoundProvider>
    <QueryClientProvider client={queryclient}>
      <App />
    </QueryClientProvider>
    </SoundProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
