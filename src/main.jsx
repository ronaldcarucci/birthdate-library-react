import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "./index.css";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </StrictMode>,
)
