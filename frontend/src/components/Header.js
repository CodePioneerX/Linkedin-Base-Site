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
import { TbSearch, TbSettings } from "react-icons/tb";
import { BiLogIn, BiLogOut, BiNetworkChart, BiMessageDetail } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { BsPersonWorkspace } from "react-icons/bs";
import { MdNotificationsNone } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import '../Assets/css/Header.css';

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
  <div>
    <div>
      <Navbar collapseOnSelect expand="xl" style={{ backgroundColor: "white" }} className="navigation" >
        <Container>

          {userInfo ? 
            (
              <Navbar.Brand href="/">
                <img src={logo} width="230" className="d-inline-block align-top" alt="Logo"/>
              </Navbar.Brand>
            ) 
            : 
            (
              <Navbar.Brand href="/connecthomepage"> 
                <img src={logo} width="230" className="d-inline-block align-top" alt="Logo" />
              </Navbar.Brand>
            )}

          <Form className="d-flex">
            <Form.Control id="searchInput" type="search" placeholder="Search..." className="me-2" aria-label="Search" value={searchValue} onSubmit={handleSearch} onChange={(e) => setSearchValue(e.target.value)} />
            
            <Nav.Link href={`/search/name/${searchValue}`} className="search_button" > <TbSearch className="icon" size={25} color="#3a0f90" /> </Nav.Link>
          </Form>

          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
          
            <Nav className="me-auto">
              
              {userInfo ?
              (<Nav.Link href="/" className="option_link d-flex" >
                <div className="d-flex align-items-center">
                  <AiFillHome className="icon" size={18}/>
                  <span className="ms-2">Home</span>
                </div>
              </Nav.Link>) 
              : 
              (<Nav.Link href="/connecthomepage" className="option_link d-flex" >
                <div className="d-flex align-items-center">
                  <AiFillHome className="icon" size={18}/>
                  <span className="ms-2">Home</span>
                </div>
              </Nav.Link>)}
              
              {userInfo ? 
              (<Nav.Link href="/network" className="option_link d-flex" >
                <div className="d-flex align-items-center">
                  <BiNetworkChart className="icon" size={18}/>
                  <span className="ms-2">Network</span>
                </div>
              </Nav.Link>) 
              :
              (<></>)}
              
              <Nav.Link href="/jobs" className="option_link d-flex"  >
                <div className="d-flex align-items-center">
                  <BsPersonWorkspace className="icon" size={18}/>
                  <span className="ms-2">Jobs</span>
                </div>
              </Nav.Link>
              
              {userInfo ? 
              (<Nav.Link href="/messaging" className="option_link d-flex"  >
                <div className="d-flex align-items-center">
                  <BiMessageDetail className="icon" size={18}/>
                  <span className="ms-2">Messaging</span>
                </div>
              </Nav.Link>) 
              : 
              (<></>)}
                
              {userInfo ? 
              (<Nav.Link href="/notifications" className="option_link d-flex">
                <div className="d-flex align-items-center">
                  <MdNotificationsNone className="icon" size={21}/>
                  <span className="ms-2">Notifications</span>
                </div>
              </Nav.Link>) 
              : 
              (<></>)}
              
              {userInfo ? 
              
                (<NavDropdown title="Profile" id="collasible-nav-dropdown" classname="option_link">
                
                  {userInfo ? 
                  (<NavDropdown.Item className="option_link d-flex" href="/profile">
                    <div className="d-flex align-items-center">
                      <CgProfile className="icon" size={18}/>
                      <span className="ms-2">My Profile</span>
                    </div>
                  </NavDropdown.Item>) 
                  : 
                  (<></>)}

                  {userInfo ? 
                  (<NavDropdown.Item className="option_link d-flex" href="/settings">
                    <div className="d-flex align-items-center">
                      <TbSettings className="icon" size={18}/>
                      <span className="ms-2">Settings</span>
                    </div>
                  </NavDropdown.Item>) 
                  : 
                  (<></>)}

                  {userInfo ? 
                  (<NavDropdown.Item className="option_link d-flex" href="/connecthomepage" onClick={ logoutHandler } id="logout" >
                    <div className="d-flex align-items-center">
                      <BiLogOut className="icon" size={18}/>
                      <span className="ms-2">Logout</span>
                    </div>
                  </NavDropdown.Item>) 
                  : 
                  (<></>)}

                </NavDropdown>) 
                : 
                (<NavDropdown.Item className="option_link d-flex" href="/connecthomepage" id="login" >
                  <div className="d-flex align-items-center">
                      <BiLogIn className="icon" size={18}/>
                      <span className="ms-2">Log In</span>
                    </div>
                </NavDropdown.Item>)}
                
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>  
  </div>
);

}
export default Header;
