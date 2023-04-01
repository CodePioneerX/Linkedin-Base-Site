import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const ProfileCard = ({ name, title, about, image }) => {

const shortAbout = about.split(".")[0] + '...';

  return (
    <Card >
      
      <Row>
        <Card.Body className='card_body'>
            <Col>
                <Card.Img className='img_profile' variant="top" src={image} />
            </Col>

            <Col>
                <Card.Title>{name}</Card.Title>
            </Col>

            <Col><Card.Subtitle className="mb-2 text-muted">{title}</Card.Subtitle></Col>
            <Col><Card.Text>{shortAbout}</Card.Text></Col>
            <Col><Button variant="primary">View Profile</Button></Col>
            
            
        </Card.Body>
      </Row>
    </Card>
  );
};

export default ProfileCard;
