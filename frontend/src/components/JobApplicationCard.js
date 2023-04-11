import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const JobApplicationCard = (props) => {


  return (
      
    <>
      <Card >
        <Row>
          <Card.Body className='card_body'style={{ height:'90px'}} >
            <div style={{display:'flex', justifyContent:'left'}}>
              <Col style={{display:'flex', justifyContent:'left'}}>
                  <Card.Img className='img-fluid rounded-pill' 
                  style={{width:'50px'}}
                  src='#' />  
                  <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem'}}>profile.name</Card.Title>             
              </Col>
              <Col style={{display:'flex', justifyContent:'right'}}>
              
                <Link to="/profileScreen" state={{data:props.senderId}}>
                  <Button variant="primary">View Profile</Button>
                </Link> 
                
              </Col>
            </div>
          </Card.Body>
        </Row>
      </Card>
    </>
  );
};

export default JobApplicationCard;