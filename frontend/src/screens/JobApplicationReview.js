import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { Container} from 'react-bootstrap';
import {  Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/App.css';
import { MdClose } from 'react-icons/md';
import JobApplicationCard from '../components/JobApplicationCard';
import { Link, useLocation } from "react-router-dom";



const JobApplicationReview = () => {

//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;
const navigate = useNavigate()

const location = useLocation();
const jobTitle = location.state.job_title;
const applications = location.state.applications;
console.log(applications)

return (
   <Container className="justify-content-md-center padd">
   <Button className='mb-4' variant='secondary' onClick={() => {navigate(-1)}}>Back</Button>
  <h2>Applications to your posted job: {jobTitle}</h2>
  {applications.map(application => (
  <JobApplicationCard  key={application.id} application={application}/>
    ))
    } 
   </Container>
);
};

export default JobApplicationReview;