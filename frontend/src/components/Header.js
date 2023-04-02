import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import logo from "../logo.jpg";
import store from "../store";

function Header(){
  const userLogin = useSelector((state) => state.userLogin);
  const [searchValue, setSearchValue] = useState('');
  const { userInfo } = userLogin;

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  
  function logoutHandler(){
    store.dispatch(logout());
  }

  const handleSearch = (event) => {
    event.preventDefault();
   // dispatch(search(searchValue));


    // navigate('/search/name/'+searchValue);
    //redirect to search page
    //window.location.href = '/search/name/'+searchValue;
  };

    return (
      <>
          <Navbar
            collapseOnSelect
            expand="lg"
            style={{ backgroundColor: "white" }}
            className="navigation"
            >
            <Container>

              {userInfo ? 
                (<Navbar.Brand href="/">
                  <img
                    src={logo}
                    width="230"
                    className="d-inline-block align-top"
                    alt="Logo"
                  />
                </Navbar.Brand>) 
                : 
                (<Navbar.Brand href="/connecthomepage">
                  <img
                    src={logo}
                    width="230"
                    className="d-inline-block align-top"
                    alt="Logo"
                  />
                </Navbar.Brand>)
              }

              <Form className="d-flex"> 
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchValue}
                  onSubmit={handleSearch}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
            
                  <Nav.Link href={`/search/name/${searchValue}`} className="btn btn-success btn-sm p-1" >
                    Search
                  </Nav.Link>
              </Form>

              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse
                id="responsive-navbar-nav"
                className="justify-content-end"
              >
                <Nav className="me-auto">
                  {userInfo ? 
                (<Nav.Link href="/" style={{ paddingRight: "40px" }}>
                    Home
                </Nav.Link>) 
                : 
                (<Nav.Link href="/connecthomepage" style={{ paddingRight: "40px" }}>
                  Home
                </Nav.Link>)}
                  {userInfo ? (
                    <Nav.Link href="/network" style={{ paddingRight: "40px" }}>
                    Network
                  </Nav.Link>
                    ) : (<></>)}
                  <Nav.Link href="/jobs" style={{ paddingRight: "40px" }} >
                    Jobs
                  </Nav.Link>
                  
                  {userInfo ? (
                    <Nav.Link href="/messaging"  style={{ paddingRight: "40px" }} >
                    Messaging
                  </Nav.Link>
                    ) : (<></>)}
                  {userInfo ? (
                    <Nav.Link href="/notifications" style={{ paddingRight: "40px" }} >
                    Notifications
                  </Nav.Link>
                    ) : (<></>)}
                  {userInfo ? (
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
                      <NavDropdown.Item href="/connecthomepage" onClick={ logoutHandler } id="logout" >
                        Logout
                      </NavDropdown.Item> 
                    ) : (
                      <NavDropdown.Item href="/connecthomepage" id="logout" >
                      Login
                    </NavDropdown.Item> 
                    )}

                  </NavDropdown>
                  ) : ( <NavDropdown.Item href="/login" id="logout" >
                  Sign in
                </NavDropdown.Item> )}
                 
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
      </>
    );
  
}
export default Header;
