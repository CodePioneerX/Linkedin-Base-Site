import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

const JobCard = (props) => {

  return (
    <Card >
    <Row >
      <Card.Body className='card_body'style={{ height:'90px'}} >
        <div style={{display:'flex', justifyContent:'left'}}>
          <Col style={{display:'flex', justifyContent:'left'}}>
              <Card.Img className='img-fluid rounded-pill' 
              style={{width:'50px'}}
              src={props.job.image} />  
              <Card.Title style={{marginLeft:'1rem',marginTop:'.7rem'}}>{props.job.title}</Card.Title>             
          </Col>
          <Col style={{display:'flex', justifyContent:'right'}}>
          
            
            <Link to='/job' state={{job_id: props.job.id}}>
              <Button variant="primary">View Detail </Button>
            </Link> 
          </Col>
        </div>
      </Card.Body>
    </Row>
  </Card>
  );
};

export default JobCard;