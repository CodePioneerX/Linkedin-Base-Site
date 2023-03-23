import React, { Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../logo.jpg";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MyNetwork from "../screens/MyNetwork";
import Jobs from "../screens/Job";
import Messaging from "../screens/Messaging";
import Notifications from "../screens/Notifications";
import Settings from "../screens/Settings";
import ViewProfile from "../screens/ViewProfile";
import Home from "../screens/Home";
import LoginPage from "../screens/LoginPage";
import store from "../store";
import { logout } from "../actions/userActions";
import { useNavigate} from 'react-router-dom';

function Header(){
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const notifications = useSelector((state) => state.notifications)
  
  let unreadNotifications = 0

  function logoutHandler(){
    store.dispatch(logout())
  }

  function getUnreadNotifications() {

  }

  if (!notifications.loading) {
    for (const notification of notifications.notifications) {
      if (notification.unread) {
        unreadNotifications += 1
      }
    }
  }

    return (
      <>
          <Navbar
            collapseOnSelect
            expand="lg"
            style={{ backgroundColor: "white" }}
            className="navigation"
          >
            <Container>
              <Navbar.Brand href="/">
                <img
                  src={logo}
                  width="230"
                  className="d-inline-block align-top"
                  alt="Logo"
                />
              </Navbar.Brand>

              <Form className="d-flex"> 
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
              </Form>

              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse
                id="responsive-navbar-nav"
                className="justify-content-end"
              >
                <Nav className="me-auto">
                  <Nav.Link href="/" style={{ paddingRight: "40px" }}>
                    Home
                  </Nav.Link>
                  <Nav.Link href="/network" style={{ paddingRight: "40px" }}>
                    Network
                  </Nav.Link>
                  <Nav.Link href="/jobs" style={{ paddingRight: "40px" }} >
                    Jobs
                  </Nav.Link>
                  <Nav.Link href="/messaging"  style={{ paddingRight: "40px" }} >
                    Messaging
                  </Nav.Link>
                  <span style={{paddingRight: "40px", position: "relative"}}>
                    <Nav.Link href="/notifications" style={{position: "relative", paddingRight: "0px" }} >
                      Notifications
                    </Nav.Link>
                    {unreadNotifications ? <p style={{position: "absolute", left: "100px", bottom: "3px" ,backgroundColor: "red", borderRadius: "10px", color: "white", padding: "0 5px"}}>{unreadNotifications}</p> : <></> }
                  </span>
                  
                  <NavDropdown title="Profile" id="collasible-nav-dropdown">
                  {userInfo ? (
                    <NavDropdown.Item href="/profile">
                      My Profile
                    </NavDropdown.Item>
                    ) : (<></>)}
                    {userInfo ? (
                    <NavDropdown.Item href="/settings">
                      Settings
                    </NavDropdown.Item>
                     ) : (<></>)}

                    {userInfo ? (
                      <NavDropdown.Item onClick={ logoutHandler } id="logout" >
                        Logout
                      </NavDropdown.Item> 
                    ) : (
                      <NavDropdown.Item href="/login" id="logout" >
                      Login
                    </NavDropdown.Item> 
                    )}



                  </NavDropdown>
                 
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
      </>
    );
  
}
export default Header;
