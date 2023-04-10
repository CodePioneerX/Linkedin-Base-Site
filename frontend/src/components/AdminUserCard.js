import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const ConnectionCard = (props) => {
    
// Define state variables
const [profile, setProfile] = useState("");

// Function to get user profile information
const getProfile = async () => {
    var userId;

    userId = props.userId

    // Send GET request to retrieve user profile information
    const {data} = await axios.get(
      `http://localhost:8000/api/profile/${props.userId}`
    );
    // Update state with retrieved profile information
    setProfile(data.profile);
  };

  const banHandler = async () => {
    const response = await axios.put(`http://localhost:8000/api/users/ban/${props.userId}`)
    window.location.reload()
  }

  const dismissReportHandler = async () => {
    const response = await axios.put(`http://localhost:8000/api/users/report/dismiss/${props.userId}`)
    window.location.reload()
  }

  // Call getProfile() function when component mounts
  useEffect(() => {
     getProfile(); 
  }, []);

  return (
    <>
      <Card >
        <Row>
          <Card.Body className='card_body' >
            <div style={{display:'flex', justifyContent:'left'}}>
              <Col style={{display:'flex', justifyContent:'left'}}>
                <Card.Img className='img-fluid rounded-pill' 
                  style={{width:'50px'}}
                  src={profile.image} />  
                <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem'}}>{profile.name}</Card.Title>             
              </Col>
              <Col style={{display:'flex', justifyContent:'right'}}>
                <Link to="/profileScreen" state={{data:props.userId}}>
                  <Button variant="primary">View Profile</Button>
                </Link>
                <div style={{paddingRight: "10px"}}></div> 
                <Button style={{height: '38px'}} onClick={dismissReportHandler} variant="secondary">Dismiss Report</Button>
                <div style={{paddingRight: "10px"}}></div> 
                <Button style={{height: '38px'}} onClick={banHandler} variant="danger">Ban User</Button>
              </Col>
            </div>
            {/* <div className="pt-3 ml-3">
              <p>Body of report message will go here.</p>
            </div> */}
          </Card.Body>
        </Row>
      </Card>
    </>
  );
};

export default ConnectionCard;
