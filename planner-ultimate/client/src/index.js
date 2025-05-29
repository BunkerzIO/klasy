import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"
import App from './App';
import {BrowserRouter} from "react-router-dom"
import ContextWrapper from './context/ContextWrapper';

//tworzy roota i uruchamia aplikację oraz ContextWrapper
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <BrowserRouter>
    <ContextWrapper>
    <App />
    </ContextWrapper>
    </BrowserRouter>
    
);


