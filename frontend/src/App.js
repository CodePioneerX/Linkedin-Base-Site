import React from "react";
import ReactDOM from "react-dom/client";
import './Assets/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
//import { Router, Routes, Route } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import ViewProfile from "./screens/ViewProfile";
import CreateJob from "./screens/CreateJob";
import CreatePost from './screens/CreatePost';
import myNetwork from './screens/MyNetwork';
import Job from './screens/Job';
import Messaging from './screens/Messaging';
import Notification from './screens/Notification';
import Settings from "./screens/Settings";
import Home from './screens/Home';
import  {Provider} from 'react-redux';
import userInfoFromStorage from './store'
import store from './store';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },  
  {
    path: "/login",
    element:<LoginPage/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },{
    path: "/profile",
    element: <ViewProfile/>,
  },{
    path: "/network",
    element: <myNetwork/>,
  },{
    path: "/jobs",
    element: <Job/>,
  },{
    path: "/messaging",
    element: <Messaging/>,
  },{
    path: "/notifications",
    element: <Notification/>,
  },{
    path: "/settings",
    element: <Settings/>,
  },{
    path: "/create/job",
    element: <CreateJob/>,
  },{
    path: "/create/post",
    element: <CreatePost/>,
  }

]);

function App() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store ={store}>
    
      <Header />
      <RouterProvider router={router} />
      <Footer />
    
    </Provider>
  );
}


export default App;
