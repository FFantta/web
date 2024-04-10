import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom';
import App from './component/app';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { ThemeProvider } from './component/ThemeContext'; 
import { AuthProvider } from './component/content/authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* 新增AuthProvider */}
      <ThemeProvider> 
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
