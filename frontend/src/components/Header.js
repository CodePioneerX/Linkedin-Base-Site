import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import { check_new_notifications, count_notifications, get_notifications } from '../actions/notificationActions'
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
  const [time, setTime] = useState(new Date())
  const { userInfo } = userLogin;

  const notificationCount = useSelector((state) => state.notificationCount)
  const {notif_count_error, notif_count_loading, notif_count} = notificationCount

  const notificationsCheckNew = useSelector((state) => state.notificationsCheckNew)
  const {new_notif_error, new_notif_loading, new_notifications} = notificationsCheckNew
  
  const dispatch = useDispatch();

  // on load, check the user's count of unread notifications
  useEffect(() => {
    if (userInfo) {
      dispatch(count_notifications(userInfo.id))
    }
  }, [userInfo])

  function logoutHandler(){
    store.dispatch(logout());
  }

  // using a timer, poll every 5000 ms to check if the user has new notifications
  useEffect(() => {
      if (userInfo) {
        const timer = setTimeout(() => check(), 5000)

        return () => clearTimeout(timer)
    }
  })
  
  // dispatch the check_new_notifications action with the previous datetime and save new datetime
  // if there are new notifications to be loaded, dispatch the count_notifications action
  const check = () => {
    var datetime = new Date(time)
    dispatch(check_new_notifications(userInfo.id, datetime.toISOString()))
    
    var currentdatetime = new Date()
    setTime(currentdatetime)

    if (!new_notif_loading && new_notifications) {
      dispatch(count_notifications(userInfo.id))
      dispatch(get_notifications(userInfo.id))
    }
  }

  const handleSearch = (event) => {
    event.preventDefault();
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
                  {(notif_count_loading || notif_count === 0) &&
                  <>
                    <MdNotificationsNone className="icon" size={21}/>  
                    <span className="ms-2">Notifications</span>
                  </>}
                  {(!notif_count_loading) && (notif_count > 0) &&
                  <>
                    <MdNotificationsNone className="icon text-danger" size={21}/>  
                    <span className="ms-2 text-danger">Notifications</span>
                    <span className="unread_notifications text-danger">({notif_count})</span> 
                  </>} 
                </div>
              </Nav.Link>) 
              : 
              (<></>)}
              
              {userInfo ? 
              
                (<NavDropdown title="Profile" id="collasible-nav-dropdown" className="option_link">
                
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
