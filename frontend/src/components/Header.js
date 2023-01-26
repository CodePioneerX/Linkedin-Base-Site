import React, { Component } from "react";
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

export default class Header extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar
            collapseOnSelect
            expand="lg"
            style={{ backgroundColor: "white" }}
            className="navigation"
          >
            <Container>
              <Navbar.Brand as={Link} to={"/"}>
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
                  <Nav.Link as={Link} to={"/"} style={{ paddingRight: "40px" }}>
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/myNetwork"}
                    style={{ paddingRight: "40px" }}
                  >
                    Network
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/jobs"}
                    style={{ paddingRight: "40px" }}
                  >
                    Jobs
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/messaging"}
                    style={{ paddingRight: "40px" }}
                  >
                    Messaging
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to={"/notification"}
                    style={{ paddingRight: "40px" }}
                  >
                    Notification
                  </Nav.Link>
                  <NavDropdown title="Profile" id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to={"/viewProfile"}>
                      View Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={"/settings"}>
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to={"/login"}>
                      Login
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </div>

        <div>
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
        </div>
      </Router>
    );
  }
}
