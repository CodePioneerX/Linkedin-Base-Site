import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { get_notifications, delete_notification, clear_notifications, read_notification, read_all_notifications, check_new_notifications } from '../actions/notificationActions'
import Alert from 'react-bootstrap/Alert';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Message from '../components/Message'
import '../Assets/css/Notifications.css';

function Notifications() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [time, setTime] = useState(new Date())

    const userLogin = useSelector(state => state.userLogin)
    const {error, loading, userInfo} = userLogin
    
    const newNotifications = useSelector(state => state.notificationsCheckNew)
    const {new_notif_error, new_notif_loading, new_notifications} = newNotifications

    const clearNotifications = useSelector(state => state.notificationClear)
    const {clear_notif_error, clear_notif_loading, clear_notif_success} = clearNotifications

    const readNotifications = useSelector(state => state.notificationRead)
    const {read_notif_error, read_notif_loading, read_notif_success} = readNotifications

    const allNotifications = useSelector(state => state.notifications)
    const {notif_error, notif_loading, notifications} = allNotifications

    // on page load, get the user's notifications and set the current datetime in state
    useEffect(() => {
        if (userInfo) {
          dispatch(get_notifications(userInfo.id))
          
          var currentdatetime = new Date();
          setTime(currentdatetime)
        }
    }, [ userInfo, dispatch ]);
    
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

    const cancelApplication = async (id, notification_id) => {
      try {
        const response = await axios.delete(
          `http://insightwearai.sytes.net:8000/api/my_job_applications/cancel/${id}/`
        )
        deleteHandler(notification_id)
        window.location.reload()
      } catch (error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    }

    // check the connections status of the two users before dispatching the delete request
    const rejectConnection = async (id, notification) => {
      try {
        const { data } = await axios.get(
          `http://insightwearai.sytes.net:8000/api/connections/status/${userInfo.id}/${id}/`)
          
        const connected = data.status
        
        if (connected === 'Connected') {
          return
        }
  
        else if (connected === 'Confirm') {
          const response = await axios.delete(
            `http://insightwearai.sytes.net:8000/api/connections/reject/${id}/${userInfo.id}/`
          )
          dispatch(read_notification(notification))
          dispatch(get_notifications(userInfo.id))
        }
  
        else {
          return
        }
      } catch (error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    }

    // checks the connection status of the two users before dispatching the accept request
    const acceptConnection = async (id, notification) => {
      try {
        const { data } = await axios.get(
          `http://insightwearai.sytes.net:8000/api/connections/status/${userInfo.id}/${id}/`)
          
        const connected = data.status

        if (connected === 'Connected') {
          return
        }
  
        else if (connected === 'Confirm') {
          const response = await axios.put(
            `http://insightwearai.sytes.net:8000/api/connections/accept/${id}/${userInfo.id}/`
          )
          dispatch(read_notification(notification))
          dispatch(get_notifications(userInfo.id))
        }

        else {
          return
        }
      } catch (error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    }

    return (
        <div className='background'>
        <div className='formContainer'>
        {userInfo ?
        <Container>
          <Row style={{display: "flex", alignItems: "center"}}>
            <Col md={8}>
              <h1>Notifications</h1>
            </Col>
            <Col md={4} >
            <Row className="justify-content-center mb-3">
              <Button className='notificationsButton' id='markAsReadButton' onClick={() => markAllReadHandler()}>
                Mark All as Read
              </Button>
              <Button className='notificationsButton' id='clearButton' onClick={clearHandler}>
                Clear
              </Button> 
            </Row>


            </Col>
          </Row>
            <Row style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            { notifications?.map(notification => (
                <Row key={notification.id} style={{width: "100%"}}>
                  <Container style={{padding: "0px", paddingBottom:"80px", width:"100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Col xs={18} md={12} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px"}}>
                      <Row >
                        <Col xs={8} md={10}>
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
                                <hr style={{width: "100%"}}/>
                              </> : 
                              <>
                                <p className="read notif-content">{notification.content}</p>
                                <hr style={{width: "100%"}}/>
                              </>
                            }
                          </Row>
                          <Row>
                            <p style={{ marginRight: "10px", color: "#808080" }}>
                              Received: {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                            </p>
                          </Row>
                        </Col>
                        <Col xs={4} md={2} style={{ display: "flex", justifyContent: "right"}}>
                            <DropdownButton id='dropdownButton' title="">
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
                                <Dropdown.Item as="button" onClick={() => acceptConnection(notification.sender, notification.id)}>Accept connection</Dropdown.Item>
                                <Dropdown.Item as="button" onClick={() => rejectConnection(notification.sender, notification.id)}>Reject connection</Dropdown.Item>
                              </>
                              }
                              {notification.type == "RECOMMENDATION" &&
                                <Dropdown.Item as="button" onClick={() => viewProfile(notification.sender)}>View profile</Dropdown.Item>
                              }
                              {notification.type == "JOBAPPLICATION" && 
                                <Dropdown.Item as="button" onClick={() => cancelApplication(notification.object_id, notification.id)}>Cancel application</Dropdown.Item>
                              }  
                            </DropdownButton>
                        </Col>
                      </Row>
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
        </div>
    )
}

export default Notifications
