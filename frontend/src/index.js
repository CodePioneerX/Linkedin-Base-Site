import React from 'react';
import ReactDOM from 'react-dom/client';
import  {Provider} from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import './Assets/css/index.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import LoginPage from './screens/LoginPage';
import userInfoFromStorage from './store'

const root = ReactDOM.createRoot(document.getElementById('root'));
const user = userInfoFromStorage;
root.render(
  <Provider store ={store}>
   {!user? (<App />) : (
     <Router> 
     
      <LoginPage/> 
      </Router> 
   )}
   
  
  </Provider>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
