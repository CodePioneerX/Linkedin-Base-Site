import React, { useState, useEffect, Component } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { Container} from 'react-bootstrap';
import {  Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/JobApplication.css';
import { MdClose } from 'react-icons/md';
import { TiArrowBack } from "react-icons/ti";
import JobApplicationCard from '../components/JobApplicationCard';



const JobApplication = () => {



//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;
const navigate = useNavigate()
const [autoFill, setAutoFillChecked] = useState(false);
const toggleAutoFillChecked = () => setAutoFillChecked(value => !value);

const [email, setEmail] = useState('')
const [name, setName] = useState('')
const [telephone, setTelephone] = useState('')
const [city, setCity] = useState('')
const [provinceState, setProvinceState] = useState('')
const [country, setCountry] = useState('')
const [experience, setExperience] = useState('')
const [work, setWork] = useState('')
const [education, setEducation] = useState('')
const [volunteering, setVolunteering] = useState('')
const [courses, setCourses] = useState('')
const [projects, setProjects] = useState('')
const [awards, setAwards] = useState('')
const [languages, setLanguages] = useState('')

const submitHandler = (e) => {
   e.preventDefault()
   //dispatch(login(email, password))

 }

return (
   <div className='formBackground'>
      <div className='jobApplicationsPage'>
         <Button className='customButton ' variant='secondary' onClick={() => {navigate(-1)}}><TiArrowBack className='icon'/><span className='backText'>Back</span></Button>
         <div className='jobApplicationsPageForm'>
            <h1>Job Application Form</h1>
            <Button className='customButton' id='autoFillButton' variant='secondary'>Autofill using my profile information</Button>
            <Form className='jobApplicationForm' onSubmit={submitHandler}>
               <hr/>
               <Label className='personalInformation' for="personalInformation"><h3>Personal Information</h3></Label>
               <FormGroup>
                  <Label for="name">Full Name</Label>
                  <Input type="text" name="name" id="name" placeholder="Enter your name" required value={name} onChange={(e)=> setName(e.target.value)}/>
               </FormGroup>
               <FormGroup >
                  <Label for="email">Email</Label>
                  <Input type="email" name="email" id="userEmail" placeholder="Enter your email" required value={email} onChange={(e)=> setEmail(e.target.value)}/>
               </FormGroup>
               <FormGroup>
                  <Label for="telephone">Phone Number</Label>
                  <Input type="tel" name="telephone" id="telephone" placeholder="Enter your phone number" required value={telephone} onChange={(e)=> setTelephone(e.target.value)}/>
               </FormGroup>
               <FormGroup >
                  <Label for="city">City</Label>
                  <Input type="text" name="city" id="city" placeholder="Enter your city name" required value={city} onChange={(e)=> setCity(e.target.value)}/>
               </FormGroup>
               <FormGroup >
                  <Label for="provinceState">Province / State</Label>
                  <Input type="text" name="provinceState" id="provinceState" placeholder="Enter your province or state name" required value={provinceState} onChange={(e)=> setProvinceState(e.target.value)}/>
               </FormGroup>
               <FormGroup >
                  <Label for="country">Country</Label>
                  <Input type="text" name="country" id="country" placeholder="Enter your country name" required value={country} onChange={(e)=> setCountry(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup >
                  <Label for="experience"><h3>Current Employment</h3></Label>
                  <textarea className= 'form-control'
                  name="experience" id="experience" value= {experience} placeholder='Enter your current employment information using the following format:&#13;&#10;Role&#13;&#10;Employer Name&#13;&#10;City, State/Province, Country&#13;&#10;Role Description' rows='5'
                  onChange={(e)=> setExperience(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup >
                  <Label className='employmentHistory' for="work"><h3>Employment History</h3></Label>
                  <textarea  className= 'form-control'
                  name="work" id="work" value = {work} placeholder='For each job entry you would like to include, enter the employment information using the following format:&#13;&#10;Role&#13;&#10;Employer Name&#13;&#10;City, State/Province, Country&#13;&#10;Role Description' rows='5'
                  onChange={(e)=> setWork(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup>
                  <Label className='education' for="education"><h3>Education</h3></Label>
                  <textarea  className= 'form-control'
                  name="education" id="education" value = {education} placeholder='For each education entry you would like to include, enter the information using the following format:&#13;&#10;Major / Area of Study&#13;&#10;Degree&#13;&#10;School Name&#13;&#10;City, State/Province, Country&#13;&#10;Additional Information' rows='5'
                  onChange={(e)=> setEducation(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup>
                  <Label className='projects' for="projects"><h3>Personal Projects</h3></Label>
                  <textarea  className= 'form-control'
                  name="projects" id="projects" value = {projects} placeholder='For each project entry you would like to include, enter the information using the following format:&#13;&#10;Project Name&#13;&#10;Project Description' rows='3'
                  onChange={(e)=> setProjects(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup>
                  <Label className='volunteering' for="volunteering"><h3>Volunteer Experience</h3></Label>
                  <textarea  className= 'form-control'
                  name="volunteering" id="volunteering" value = {volunteering} placeholder='For each volunteer experience entry you would like to include, enter the information using the following format:&#13;&#10;Role&#13;&#10;Organization Name&#13;&#10;City, State/Province, Country&#13;&#10;Role Description' rows='5'
                  onChange={(e)=> setVolunteering(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup>
                  <Label className='courses' for="courses"><h3>Courses</h3></Label>
                  <textarea  className= 'form-control'
                  name="courses" id="courses" value = {courses} placeholder='For each course entry you would like to include, enter the information using the following format:&#13;&#10;Course Name&#13;&#10;Organisation Name&#13;&#10;City, State/Province, Country&#13;&#10;Course Description' rows='5'
                  onChange={(e)=> setCourses(e.target.value)}/>
               </FormGroup>
               <hr/>
               <FormGroup>
                  <Label className='awards' for="awards"><h3>Awards</h3></Label>
                  <textarea  className= 'form-control'
                  name="awards" id="awards" value = {awards} placeholder='For each award entry you would like to include, enter the information using the following format:&#13;&#10;Award Name&#13;&#10;Organisation Name&#13;&#10;City, State/Province, Country&#13;&#10;Award Description' rows='5'
                  onChange={(e)=> setAwards(e.target.value)}/>
               </FormGroup>
               <hr/>               
               <FormGroup>
                  <Label className='languages' for="languages"><h3>Languages</h3></Label>
                  <textarea  className= 'form-control'
                  name="languages" id="languages" value = {languages} placeholder='For each language entry you would like to include, enter the information using the following format:&#13;&#10;Language&#13;&#10;Level of Fluency' rows='3'
                  onChange={(e)=> setLanguages(e.target.value)}/>
               </FormGroup>
               <hr/>
               <p>Before submitting your application, please verify that the information provided above is both accurate and genuine.</p>
               <Button id='apply' className='customButton' type='submit' >Send Application Now</Button>
            </Form>
            
         </div>
      </div>
   </div>
);
};

export default JobApplication;