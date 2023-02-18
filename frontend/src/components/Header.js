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
import Notification from "../screens/Notification";
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
  //const navigate = useNavigate();
  
function logoutHandler(){
  store.dispatch(logout())
  // this.props.navigation.navigate('Jobs')
  //window.location.reload(false);
  // window.location.assign("/login")
  // navigate("/login");
  // console.log('reached here')
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
                  <Nav.Link href="/notifications" style={{ paddingRight: "40px" }} >
                    Notification
                  </Nav.Link>
                  
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
    

        {/* <div>
          <Routes>  
            <Route path="/" element={<Home />} />

            <Route path="/myNetwork" element={<MyNetwork />} />

            <Route path="/jobs" element={<Jobs />} />

            <Route path="/messaging" element={<Messaging />} />

            <Route path="/notification" element={<Notification />} />

            <Route path="/viewProfile" element={<ViewProfile />} />

            <Route path="/settings" element={<Settings />} />

            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div> */}
      </>
    );
  
}
export default Header;
