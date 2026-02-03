import './main.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './form';

createRoot(document.body).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
