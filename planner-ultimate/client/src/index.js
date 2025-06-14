import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import App from './App';
import {BrowserRouter} from "react-router-dom"
import ContextWrapper from './context/ContextWrapper';
import { AuthProvider } from './context/AuthContext';
//tworzy roota i uruchamia aplikację oraz ContextWrapper
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>    
    
);


