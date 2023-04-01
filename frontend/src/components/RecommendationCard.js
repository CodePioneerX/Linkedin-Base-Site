import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const RecommendationCard = (props) => {

// const shortAbout = about.split(".")[0] + '...';
const [profile, setProfile] = useState("");

const getProfile = async () => {
    var userId;

    switch(props.type) {
      case 'sent':
        userId = props.recipientId;
        break;
      case 'received':
        userId = props.senderId;
        break;
      default:
        userId = props.recipientId;
        break;
    }

    const {data} = await axios.get(
      `http://localhost:8000/api/profile/${userId}`
    );
    setProfile(data.profile);
  };

  useEffect(() => {
     getProfile(); 
  }, [ getProfile ]);

  return (
    <>
      <Card >
        <Row>
          <Card.Body className='card_body' style={{paddingBottom: "0px"}}>
            <div style={{display:'flex', justifyContent:'left'}}>
              <Col style={{display:'flex', justifyContent:'left'}}>
                  <Card.Img className='img-fluid rounded-pill' 
                  style={{width:'50px'}}
                  src={profile.image} />  
                  <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem',color: "#644d81"}}>{profile.name}</Card.Title>             
              </Col>
              <Col style={{display:'flex', justifyContent:'right'}}>
              {props.type == 'received' ? 
                <>
                  <Link to="/profileScreen" state={{data:props.senderId}}>
                    <Button variant="primary">View Profile</Button>
                  </Link> 
                </> : 
                <>
                  <Link to="/profileScreen" state={{data:props.recipientId}} >
                    <Button variant="primary">View Profile</Button>
                  </Link> 
                </>}
              </Col>
            </div>
            <div>
              <p style={{ padding: "10px" }}>{props.description}</p>
            </div>
          </Card.Body>
        </Row>
      </Card>
    </>
  );
};

export default RecommendationCard;
