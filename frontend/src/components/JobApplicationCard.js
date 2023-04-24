import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col,Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {remove_job_application_review} from '../actions/jobActions';
import { useDispatch } from "react-redux";
import '../Assets/css/App.css';
import '../Assets/css/JobApplication.css';

const JobApplicationCard = (props) => {

//the following variables and functions are for displaying applicants' images
const [profile, setProfile] = useState("");
//get the user's profile information using the profile id
const getProfile = async () => {    
      const {data} = await axios.get(
        `http://insightwearai.sytes.net:8000/api/profile/${props.application.user}`
      );
      setProfile(data.profile);     
    }
    
useEffect(() => {
    getProfile(); 
}, []);


const dispatch = useDispatch();
const navigate = useNavigate();
const deleteJobApplication = (e) =>{
    e.preventDefault();
    dispatch(remove_job_application_review(props.application.id))
    navigate('/profile');
}


  return (
      
    <>
      <Card style={{ margin: "20px" }} className='job-application-card'>
          <Card.Body>
            <Row className='pb-5'>
                <Col xs={6}>
                  <Row>
                    <Card.Img className='img-fluid rounded-pill' 
                    style={{width:'50px'}}
                    src={profile.image} />  
                    <Link to="/profileScreen" className="profile-job-card-title" state={{data:props.application.user}}>
                      <Card.Title style={{marginLeft:'1rem'}}> Name: {props.application.name}</Card.Title>    
                    </Link>            
                  </Row>
                  <Row>
                    <Card.Text style={{marginLeft:'5rem'}}>{props.application.email}</Card.Text> 
                  </Row>
                </Col>
                <Col xs={3} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Link to="/applicationDetail" state={{data:props.application}}>
                    <Button className="job-application-view-button">View Application Detail</Button>
                  </Link> 
                </Col>
                <Col xs={3}>
                  <Button className="job-application-remove-button" onClick={deleteJobApplication}>Remove This Application</Button>
                </Col>
            </Row> 
          </Card.Body>
      </Card>

    </>
  );
};

export default JobApplicationCard;