import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const ConnectionCard = (props) => {

// const shortAbout = about.split(".")[0] + '...';
const [profile, setProfile] = useState("");

const getProfile = async () => {
    const {data} = await axios.get(
      `http://localhost:8000/api/profile/` + props.userId
    );
    setProfile(data.profile);
    
  };

  useEffect(() => {
     getProfile(); 
    // dispatch(get_profile(userInfo.id))
  }, []);
  
  //To make sure the useState get the newest value, don't comment this line
  console.log(profile)

  return (
    <Card >
      
      <Row>
        <Card.Body className='card_body'style={{ height:'90px'}} >
            <div style={{display:'flex', justifyContent:'left'}}>
            <Col style={{display:'flex', justifyContent:'left'}}>
            {/* variant="top" */}
                <Card.Img className='img-fluid rounded-pill' 
                style={{width:'50px'}}
                src={profile.image} />  
                 <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem'}}>{profile.name}</Card.Title>             
            </Col>

            {/* <Col><Card.Subtitle className="mb-2 text-muted">title</Card.Subtitle></Col>
            <Col><Card.Text>about</Card.Text></Col> */}
            <Col style={{display:'flex', justifyContent:'right'}}>
            <Link to="/profileScreen" state={{data:props.userId}}>
            <Button variant="primary">View Profile</Button>
            </Link>
            </Col>
            </div>
            
        </Card.Body>
      </Row>
    </Card>
  );
};

export default ConnectionCard;