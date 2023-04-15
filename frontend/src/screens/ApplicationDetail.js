import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { Container} from 'react-bootstrap';
import {  Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/App.css';
import { MdClose } from 'react-icons/md';
import JobApplicationCard from '../components/JobApplicationCard';
import { Link, useLocation } from "react-router-dom";



const ApplicationDetail= () => {

//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;
const navigate = useNavigate()

const location = useLocation();
const applications = location.state.data;
console.log(applications)

return (
   <Container className="justify-content-md-center padd">
   <Button className='mb-4' variant='secondary' onClick={() => {navigate(-1)}}>Back</Button>
  <h2>Applications Details</h2>
   </Container>
);
};

export default ApplicationDetail;