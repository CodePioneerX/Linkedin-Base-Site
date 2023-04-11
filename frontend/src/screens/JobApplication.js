import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import {  Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/App.css';
import { MdClose } from 'react-icons/md';



const JobApplication = () => {

//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;
const navigate = useNavigate()

return (
   <>
   <Button className='mb-4' variant='secondary' onClick={() => {navigate(-1)}}>Back</Button>
  <p>Job Application page</p>
   </>
);
};

export default JobApplication;