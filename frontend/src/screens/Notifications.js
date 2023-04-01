import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { get_notifications, delete_notification, clear_notifications, read_notification, read_all_notifications } from '../actions/notificationActions'
import Alert from 'react-bootstrap/Alert';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import '../Assets/css/Notifications.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEnvelopeOpen, faEnvelope } from '@fortawesome/free-regular-svg-icons';

function Notifications() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const {error, loading, userInfo} = userLogin
    
    useEffect(() => {
        if (userInfo) {
            dispatch(get_notifications(userInfo.id))
        }
    }, [ userInfo, dispatch ]);

    const notifications = useSelector((state) => state.notifications.notifications)

    const deleteHandler = (notification_id) => {
        dispatch(delete_notification(notification_id))
        window.location.reload()
    }

    const readHandler = (notification_id) => {
      dispatch(read_notification(notification_id))
      window.location.reload()
    }

    const markAllReadHandler = () => {
      dispatch(read_all_notifications(userInfo.id))
      window.location.reload()
    }

    const clearHandler = () => {
      dispatch(clear_notifications(userInfo.id))
      window.location.reload()
    }

    const viewJob = (id) => {
      navigate('/job', { state: {job_id: id} })
    }

    const viewProfile = (id) => {
      navigate('/profileScreen', { state: {data: id} })
    }

    const rejectConnection = async (id) => {
      const response = await axios.delete(
        `http://localhost:8000/api/connections/reject/${id}/${userInfo.id}/`
      )
    }

    const acceptConnection = async (id) => {
      const response = await axios.put(
        `http://localhost:8000/api/connections/accept/${id}/${userInfo.id}/`
      )
    }

    return (
        <div>
        {userInfo ?
        <Container>
          <Row style={{display: "flex", alignItems: "center"}}>
            <Col md={8}>
              <h1>Notifications</h1>
            </Col>
            <Col md={4} >
              <Row className="justify-content-md-center mb-3">
                <Col xs={1}></Col>
                <Col xs={5}>
                  <Button className='btn btn-secondary' onClick={() => markAllReadHandler()}>
                        Mark All as Read
                  </Button> 
                </Col>
                <Col xs={5}>
                  <Button className='btn btn-danger' onClick={clearHandler}>
                        Clear Notifications
                  </Button> 
                </Col>
                <Col xs={1}></Col>
              </Row>
            </Col>
          </Row>
            <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "100px"}}>
            { notifications?.map(notification => (
                <Row key={notification.id} style={{width: "100%"}}>
                  <Container style={{paddingBottom:"80px", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Col xs={8} md={12} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px"}}>
                      <div style={{borderBottom: "1px solid #d3d3d3", marginBottom:"10px"}}></div>
                      <Row style={{ display: "flex", alignItems: "center"}}>
                        <Col xs={8} md={10} style={{paddingLeft: "2rem"}}>
                          <Row>
                            {notification.unread ? 
                              <>
                                <h4 className="unread notif-title">{notification.title}</h4>
                              </> : 
                              <>
                                <h4 className="read notif-title">{notification.title}</h4>
                              </>
                            }
                          </Row>
                          <Row>
                            {notification.unread ? 
                              <>
                                <p className="unread notif-content">{notification.content}</p>
                              </> : 
                              <>
                                <p className="read notif-content">{notification.content}</p>
                              </>
                            }
                          </Row>
                          <Row>
                            <p style={{ marginRight: "10px", fontSize: "14px", color: "#808080" }}>
                              Received: {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                            </p>
                          </Row>
                        </Col>
                        <Col xs={4} md={2} style={{ display: "flex", justifyContent: "right"}}>
                            <DropdownButton variant="secondary" title="">
                              {notification.unread ? 
                                <Dropdown.Item as="button" onClick={() => readHandler(notification.id)}>Mark as read</Dropdown.Item> :
                                <Dropdown.Item as="button" onClick={() => readHandler(notification.id)}>Mark as unread</Dropdown.Item> 
                              }
                              <Dropdown.Item as="button" onClick={() => deleteHandler(notification.id)}>Delete</Dropdown.Item>
                              {notification.type == "JOBALERT" && 
                                <Dropdown.Item as="button" onClick={() => viewJob(notification.object_id)}>View job</Dropdown.Item>
                              }
                              {notification.type == "CONNECTION" &&
                                <Dropdown.Item as="button" onClick={() => viewProfile(notification.sender)}>View profile</Dropdown.Item>
                              }
                              {notification.type == "CONNECTION" && notification.title.includes("sent") &&
                              <>
                                <Dropdown.Item as="button" onClick={() => acceptConnection(notification.sender)}>Accept connection</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => rejectConnection(notification.sender)}>Reject connection</Dropdown.Item>
                              </>
                              }
                              {notification.type == "RECOMMENDATION" &&
                                <Dropdown.Item as="button" onClick={() => viewProfile(notification.sender)}>View profile</Dropdown.Item>
                              }  
                            </DropdownButton>
                        </Col>
                      </Row>
                      <div style={{borderBottom: "1px solid #d3d3d3", marginBottom:"10px"}}></div>
                    </Col>
                    </Container>
                </Row>

            ))}

            </Row>


        </Container> :
          <Container className="justify-content-md-center padd">
          <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>
        </Container>
          }
      </div>
    )
}

export default Notifications
