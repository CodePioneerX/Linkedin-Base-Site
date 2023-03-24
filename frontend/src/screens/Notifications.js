import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { get_notifications, delete_notification, clear_notifications, read_notification, read_all_notifications } from '../actions/notificationActions'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

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

    return (
        <div>
        {userInfo ?
        <>  
          <Row>
            <Col md={8}>
              <h1>Notifications</h1>
            </Col>
            <Col md={2}>
              <Button className='btn btn-secondary' onClick={() => markAllReadHandler()} style={{margin: "10px 0 0 0"}}>
                    Mark All as Read
              </Button> 
            </Col>
            <Col md={2}>
              <Button className='btn btn-danger' onClick={clearHandler} style={{margin: "10px 0 0 0"}}>
                    Clear Notifications
              </Button> 
            </Col>
          </Row>
            <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"100px"}}>
            { notifications?.map(notification => (
                <Row key={notification.id} style={{marginBottom: "25px", width: "75%"}}>
                    <Container style={{padding: "35px 0 0 35px", paddingBottom: "0"}}>
                    <Col xs={12} md={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px", width: "auto"}}>
                      <div style={{borderBottom: "1px solid #d3d3d3", marginBottom:"10px"}}></div>
                      <Row style={{ display: "flex", alignItems: "center"}}>
                        <Col xs={11}>
                          <h4 style={{ textAlign: "left", paddingBottom: "5px", paddingTop:"6px"}}>{notification.title}</h4>
                        </Col>
                        <Col xs={1}>
                          <span>
                            <button onClick={() => deleteHandler(notification.id)} style={{ backgroundColor: "white", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}>
                                <FontAwesomeIcon icon={faTrashAlt} style={{ color: "red"}}/> 
                            </button>
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col xs={11}>
                          <p style={{padding: "15px 0"}}>{notification.content}</p>
                        </Col>
                        <Col xs={1}>
                          {notification.unread ? 
                            <button onClick={() => readHandler(notification.id)} style={{ backgroundColor: "white", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}>
                              <FontAwesomeIcon icon={faEnvelope} style={{ color: "red"}}/> 
                            </button> 
                            : 
                            <button onClick={() => readHandler(notification.id)} style={{ backgroundColor: "white", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}>
                              <FontAwesomeIcon icon={faEnvelopeOpen} style={{ color: "green"}}/> 
                            </button> 
                            }
                          {/* </span> */}

                        </Col>
                      </Row>
                      <Row>
                        <Col xs={10}>
                          <p style={{ marginRight: "10px", fontSize: "14px", color: "#808080" }}>
                            Received: {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                          </p>
                        </Col>
                      </Row>
                      <div style={{borderBottom: "1px solid #d3d3d3", marginBottom:"10px"}}></div>
                    </Col>
                    </Container>
                </Row>

            ))}

            </Row>


        </> :
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
