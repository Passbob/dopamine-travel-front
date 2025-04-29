import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
const appElement = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// react-snap 프리렌더링을 위한 조건부 렌더링
const hasChildNodes = rootElement.hasChildNodes();
if (hasChildNodes) {
  ReactDOM.hydrateRoot(rootElement, appElement);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(appElement);
}

