import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col,Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {remove_job_application_review} from '../actions/jobActions';
import { useDispatch } from "react-redux";

const JobApplicationCard = (props) => {

//the following variables and functions are for displaying applicants' images
const [profile, setProfile] = useState("");
//get the user's profile information using the profile id
const getProfile = async () => {    
      const {data} = await axios.get(
        `http://localhost:8000/api/profile/${props.application.user}`
      );
      setProfile(data.profile);     
    }
    
useEffect(() => {
    getProfile(); 
}, []);


const dispatch = useDispatch();
const navigate = useNavigate();
const deleteJobReview = (e)=>{
    e.preventDefault();
    dispatch(remove_job_application_review(props.application.user,props.jobId))
    navigate('/profile');
}


  return (
      
    <>
      <Card style={{ marginTop: "20px" }}>
          <Card.Body className='card_body'>
            <Row>
                <div>
                <Col style={{display:'flex', justifyContent:'left'}}>
                    <Card.Img className='img-fluid rounded-pill' 
                    style={{width:'50px'}}
                    src={profile.image} />  
                    <Link to="/profileScreen" state={{data:props.application.user}}>
                      <Card.Title style={{marginLeft:'1rem'}}> Name: {props.application.name}</Card.Title>    
                    </Link>            
                </Col>
                    <Card.Text style={{marginLeft:'5rem'}}>{props.application.email}</Card.Text> 
                </div>

                <Col style={{display:'flex', justifyContent:'right'}}>
                    <Link to="/applicationDetail" state={{data:props.application}}>
                        <Button variant="primary">View Application Detail</Button>
                    </Link> 
                </Col>
            </Row> 
            <hr style={{margin:'1rem'}}/>

            <Row style={{display:'flex', justifyContent:'right'}}>
                <Col style={{display:'flex', justifyContent:'right'}}>
                <Button variant="danger" onClick={deleteJobReview}>Remove This Application</Button>
                </Col>
            </Row>
          </Card.Body>
      </Card>

    </>
  );
};

export default JobApplicationCard;