import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import SocketsProvider from './context/SocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <SocketsProvider>
      <App />
    </SocketsProvider>
  </React.StrictMode>
);
