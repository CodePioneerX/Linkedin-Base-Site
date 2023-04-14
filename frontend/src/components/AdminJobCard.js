import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

const AdminJobCard = (props) => {
    
  // Define state variables
  const [reportMessages, setReportMessages] = useState("");

  const banHandler = async () => {
    const response = await axios.put(`http://localhost:8000/api/users/ban/${author_id}`)
    window.location.reload()
  }

  const dismissReportHandler = async () => {
    const response = await axios.delete(`http://localhost:8000/api/jobs/report/dismiss/${id}`)
    window.location.reload()
  }

  const deleteJobHandler = async () => {
    const response = await axios.delete(`http://localhost:8000/api/job/delete/${job_id}`)
    window.location.reload()
  }

  const { id, sender_id, sender_name, sender_email, job_id, job_title, job_company, job_location, message, author_id, author_name } = props.report

  return (
    <>
      <Card className='mb-3'>
        <Row>
          <Card.Body className='card_body' >
            <Row style={{display:'flex', justifyContent:'left'}}>
              <Col style={{display:'flex', justifyContent:'left'}}>
                <Card.Title style={{marginLeft:'1rem'}}>Job Author: {author_name}</Card.Title>
              </Col>
              <Col className="mr-3" style={{display:'flex', justifyContent:'right'}}>
                <Link to="/profileScreen" state={{data:author_id}}>
                  <Button variant="primary">View Profile</Button>
                </Link>
                <div style={{paddingRight: "10px"}}></div> 
                <Button style={{height: '38px'}} onClick={banHandler} variant="danger">Ban User</Button>
              </Col>
            </Row>
            <Row>
                <Col className="ml-3">
                    <strong>{job_title} at {job_company} in {job_location}</strong>
                </Col>
                <Col className="mr-3 pt-3" style={{display:'flex', justifyContent:'right'}}>
                    <Button style={{height: '38px'}} onClick={dismissReportHandler} variant="secondary">Dismiss Report</Button>
                    <div style={{paddingRight: "10px"}}></div> 
                    <Button style={{height: '38px'}} onClick={deleteJobHandler} variant="danger">Delete Job</Button>
                </Col>
            </Row>
            <div className="pt-3 ml-3">
                <div className='pb-1'>
                  <span> 
                    <strong>{sender_name}</strong> ({sender_email}): "{message}"
                  </span>
                </div>
            </div>
          </Card.Body>
        </Row>
      </Card>
    </>
  );
};

export default AdminJobCard;
