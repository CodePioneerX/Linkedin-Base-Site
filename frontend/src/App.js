import React from "react";
import ReactDOM from "react-dom/client";
import './Assets/css/myApp.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
//import { Router, Routes, Route } from 'react-router-dom';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Container } from 'react-bootstrap';
import { ProfileScreen } from "./screens/ProfileScreen";
import LoginPage from './screens/LoginPage';
import ForgotPassword from './screens/ForgotPassword';
import PasswordReset from './screens/PasswordReset';
import ConnectHomePage from './screens/ConnectHomePage';
import RegisterPage from './screens/RegisterPage';
import ViewProfile from "./screens/ViewProfile";
import CreateJobForm from './components/CreateJobForm';
import CreatePost from './screens/CreatePost';
import {MyNetwork} from './screens/MyNetwork';
import JobScreen from './screens/JobScreen';
import JobsScreen from './screens/JobsScreen';
import Messaging from './screens/Messaging';
import Notifications from './screens/Notifications';
import Settings from "./screens/Settings";
import Home from './screens/Home';
import SearchScreen from "./screens/SearchScreen";
import JobApplication from "./screens/JobApplication";
import JobApplicationReview from "./screens/JobApplicationReview";
import ApplicationDetail from "./screens/ApplicationDetail";
import AdminUserScreen from "./screens/AdminUserScreen";
import AdminPostScreen from "./screens/AdminPostScreen";
import AdminJobScreen from "./screens/AdminJobScreen";
import  {Provider} from 'react-redux';
import store from './store';



const router = createBrowserRouter([
  {
    path: "/connecthomepage",
    element: <ConnectHomePage/>,
  },
  {
    path: "/",
    element: <Home/>,
  },  
  {
    path: "/login",
    element:<LoginPage/>,
  },
  {
    path: "/forgotpassword",
    element:<ForgotPassword/>,
  },
  {
    path: "/password_reset_form/:uidb64/:token",
    element:<PasswordReset/>,
  },
  {
    path: "/register",
    element: <RegisterPage/>,
  },{
    path: "/profile",
    element: <ViewProfile/>,
  },{
    path: "/network",
    element: <MyNetwork/>,
  },{
    path: "/jobs",
    element: <JobsScreen/>,
  },{
    path: "/job",
    element: <JobScreen/>,
  },{
    path: "/messaging",
    element: <Messaging/>,
  },{
    path: "/notifications",
    element: <Notifications/>,
  },{
    path: "/settings",
    element: <Settings/>,
  },
  {
    path: "/create/job/",
    element: <CreateJobForm/>
  },{
    path: "search/name/:name",
    element: <SearchScreen/>
  },{
    path: "search/name/",
    element: <SearchScreen/>
  },{
    path: "create/post/",
    element: <CreatePost/>
  },{
    path: "/profileScreen",
    element: <ProfileScreen/>
  },{
    path: "/jobApplication",
    element: <JobApplication/>
  },{
    path: "/jobApplicationReview",
    element: <JobApplicationReview/>
  },{
    path: "/applicationDetail",
    element: <ApplicationDetail />
  },{
    path: "/admin/moderate/users",
    element: <AdminUserScreen/>
  },{
    path: "/admin/moderate/posts",
    element: <AdminPostScreen/>
  },{
    path: "/admin/moderate/jobs",
    element: <AdminJobScreen/>
  }
]);

function App() {
  return (
    <Provider store ={store}>
    
      <Header />
      <RouterProvider router={router} />
      <Footer />
    
    </Provider>
  );
}

export default App;
