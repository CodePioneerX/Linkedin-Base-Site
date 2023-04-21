import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";

const ProfileCard = (props) => {

const [profile, setProfile] = useState("");
// console.log(props)
//get the user's profile information using the profile id
const getProfile = async () => {

  const {data} = await axios.get(
    `http://localhost:8000/api/profile/${props.user.id}`
  );
  setProfile(data.profile);
  
}

useEffect(() => {
  getProfile(); 
}, []);

  return (
    <Card>
    <Row >
      <Card.Body className='card_body'style={{ height:'90px'}}>
        <div style={{display:'flex', justifyContent:'left'}}>
          <Col style={{display:'flex', justifyContent:'left'}}>
              <Card.Img className='img-fluid rounded-pill' 
              style={{width:'50px'}}
              src={profile.image} />  
              <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem'}}>{props.user.name}</Card.Title>             
          </Col>
          <Col style={{display:'flex', justifyContent:'right'}}>
          
          {/* navigate to the user's profile page */}
            <Link to="/profileScreen" state={{data:props.user.id}}>
              <Button variant="primary">View Profile</Button>
            </Link> 
          </Col>
        </div>
      </Card.Body>
    </Row>
  </Card>
  );
};

export default ProfileCard;