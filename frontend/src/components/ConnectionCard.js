import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const ConnectionCard = (props) => {

// const shortAbout = about.split(".")[0] + '...';
const [profile, setProfile] = useState("");

const getProfile = async () => {
    var userId;

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

    const {data} = await axios.get(
      `http://insightwearai.sytes.net:8000/api/profile/${userId}`
    );
    setProfile(data.profile);
    
  };

  const acceptHandler = async () => {
    // accept connection request
    const response = await axios.put(
      `http://insightwearai.sytes.net:8000/api/connections/accept/${props.senderId}/${props.recipientId}/`
    )
    window.location.reload()
  }

  const rejectHandler = async () => {
    // reject connection request
    const response = await axios.delete(
      `http://insightwearai.sytes.net:8000/api/connections/reject/${props.senderId}/${props.recipientId}/`
    )
    window.location.reload()
  }

  const cancelHandler = async () => {
    // cancel sent connection request
    const response = await axios.delete(
      `http://insightwearai.sytes.net:8000/api/connections/cancel/${props.senderId}/${props.recipientId}/`  
    )
    window.location.reload()
  }

  const sendConnectionRequestHandler = async () => {
    // send connection request
    const response = await axios.post(
      `http://insightwearai.sytes.net:8000/api/connections/create/${props.senderId}/${props.recipientId}/`  
    )
    window.location.reload()
  }

  useEffect(() => {
     getProfile(); 
  }, []);

  return (
    <>
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
