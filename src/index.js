import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Importe le Router
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Enveloppe <App /> avec le BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);