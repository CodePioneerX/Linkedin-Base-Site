import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const ConnectionCard = (props) => {

// const shortAbout = about.split(".")[0] + '...';
    
// Define state variables
const [profile, setProfile] = useState("");

// Function to get user profile information
const getProfile = async () => {
    var userId;

    // Set userId based on connection type
    switch(props.type) {
      case 'received':
        userId = props.senderId;
        break;
      case 'sent':
        userId = props.recipientId;
        break;
      case 'possible':
        userId = props.recipientId;
        break;
      default:
        userId = props.recipientId;
        break;
    }

    // Send GET request to retrieve user profile information
    const {data} = await axios.get(
      `http://localhost:8000/api/profile/${userId}`
    );
    // Update state with retrieved profile information
    setProfile(data.profile);
    
  };

  // Function to handle accepting a connection request
  const acceptHandler = async () => {
    // accept connection request
    const response = await axios.put(
      `http://localhost:8000/api/connections/accept/${props.senderId}/${props.recipientId}/`
    )
    // Reload the page to show updated connection status
    window.location.reload()
  }

  // Function to handle rejecting a connection request
  const rejectHandler = async () => {
   // Send DELETE request to delete connection request
    const response = await axios.delete(
      `http://localhost:8000/api/connections/reject/${props.senderId}/${props.recipientId}/`
    )
    // Reload the page to show deleted connection request
    window.location.reload()
  }

  // Function to handle cancelling a sent connection request
  const cancelHandler = async () => {
    // cancel sent connection request
    const response = await axios.delete(
      `http://localhost:8000/api/connections/cancel/${props.senderId}/${props.recipientId}/`  
    )
    window.location.reload()
  }

  
  // Function to handle sending a connection request
  const sendConnectionRequestHandler = async () => {
  // Send POST request to create new connection request
    const response = await axios.post(
      `http://localhost:8000/api/connections/create/${props.senderId}/${props.recipientId}/`  
    )
    // Reload the page to show newly created connection request
    window.location.reload()
  }

  // Call getProfile() function when component mounts
  useEffect(() => {
     getProfile(); 
  }, []);

  return (
    <>
      //Card displaying the profile name, option to view profile, buttons to accept, reject, send conection request
      <Card >
        <Row>
          <Card.Body className='card_body'style={{ height:'90px'}} >
            <div style={{display:'flex', justifyContent:'left'}}>
              <Col style={{display:'flex', justifyContent:'left'}}>
                  <Card.Img className='img-fluid rounded-pill' 
                  style={{width:'50px'}}
                  src={profile.image} />  
                  <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem'}}>{profile.name}</Card.Title>             
              </Col>
              <Col style={{display:'flex', justifyContent:'right'}}>
              {props.status == 'accepted' ? 
                <Link to="/profileScreen" state={{data:props.senderId}}>
                  <Button variant="primary">View Profile</Button>
                </Link> : 
                <>
                  {props.type == 'received' && 
                    <>
                      <Link to="/profileScreen" state={{data:props.senderId}}>
                        <Button variant="primary">View Profile</Button>
                      </Link>
                      <div style={{paddingRight: "10px"}}></div>  
                      <Button style={{height: '38px'}} onClick={acceptHandler} variant="secondary">Accept</Button>
                      <div style={{paddingRight: "10px"}}></div>  
                      <Button style={{height: '38px'}} onClick={rejectHandler} variant="danger">Reject</Button>
                    </>
                  }
                  {props.type == 'sent' && 
                    <>
                      <Link to="/profileScreen" state={{data:props.recipientId}}>
                          <Button variant="primary">View Profile</Button>
                      </Link>
                      <div style={{paddingRight: "10px"}}></div>  
                      <Button style={{height: '38px'}} onClick={cancelHandler} variant="danger">Cancel</Button>
                    </> 
                  }
                  {props.type == 'possible' && 
                    <>
                      <Link to="/profileScreen" state={{data:props.recipientId}}>
                        <Button variant="primary">View Profile</Button>
                      </Link>
                      <div style={{paddingRight: "10px"}}></div>  
                      <Button style={{height: '38px'}} onClick={sendConnectionRequestHandler} variant="secondary">Send Connection Request</Button>
                    </> 
                  }
                </>
              }
              </Col>
            </div>
          </Card.Body>
        </Row>
      </Card>
    </>
  );
};

export default ConnectionCard;
