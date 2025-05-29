import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CustomPokemonProvider } from './context/CustomPokemonContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CustomPokemonProvider>
        <App />
      </CustomPokemonProvider>
    </BrowserRouter>
  </StrictMode>
);
