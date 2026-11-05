import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/zilla-slab/latin-500.css';
import '@fontsource/zilla-slab/latin-600.css';
import '@fontsource/zilla-slab/latin-700.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import './styles/app.css';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
