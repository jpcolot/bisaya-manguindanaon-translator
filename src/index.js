import React from 'react';
import ReactDOM from 'react-dom/client';
import { StateProvider } from "./context/StateProvider";
import reducer, { initialState } from "./context/reducer";
import App from './App';
import 'antd/dist/antd.css';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>
  // </React.StrictMode>
);

