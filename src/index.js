import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// styles
import './App.css';
import AuthProvider from 'react-auth-kit';
import createStore from 'react-auth-kit/createStore';

const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore({
  authName:'_auth_',
  authType:'localstorage',
 })

root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);