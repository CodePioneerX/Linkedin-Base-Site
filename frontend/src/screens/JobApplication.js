import React, { useState, useEffect, Component } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from 'react-router-dom'
import { Container} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import {  Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/JobApplication.css';
import { MdClose } from 'react-icons/md';
import { TiArrowBack } from "react-icons/ti";
import JobApplicationCard from '../components/JobApplicationCard';
import axios from "axios";
import{ create_job_application } from '../actions/jobActions'



const JobApplication = () => {

   //Get the user information from the store
   const userLogin = useSelector((state) => state.userLogin);
   const { userInfo } = userLogin;
   const navigate = useNavigate()

   const location = useLocation()
   const job_id = location.state?.job_id

   //form submission status
   const [submitStatus, setSubmitStatus] = useState(null); 
   const dispatch = useDispatch();

   //State variables that store the information inputted by the user
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [telephone, setTelephone] = useState('');
   const [city, setCity] = useState('');
   const [provinceState, setProvinceState] = useState('');
   const [country, setCountry] = useState('');
   const [experience, setExperience] = useState('');
   const [work, setWork] = useState('');
   const [education, setEducation] = useState('');
   const [volunteering, setVolunteering] = useState('');
   const [courses, setCourses] = useState('');
   const [projects, setProjects] = useState('');
   const [awards, setAwards] = useState('');
   const [languages, setLanguages] = useState('');
   const [resume, setResume] = useState(null);
   const [coverLetter, setCoverLetter] = useState(null);
   const [recommendationLetter, setRecommendationLetter] = useState(null);
   const [portfolio, setPortfolio] = useState(null);
   const [transcript, setTranscript] = useState(null);
   const [otherDocuments, setOtherDocuments] = useState(null);
   const [profile, setProfile] = useState('');
   const [job, setJob] = useState('')

   //Event handlers that get triggered when the user selects files for uploading
   const handleResumeChange = (event) => {
      setResume(event.target.files[0]);
   };
   const handleCoverLetterChange = (event) => {
      setCoverLetter(event.target.files[0]);
   };
   const handleRecommendationLetterChange = (event) => {
      setRecommendationLetter(event.target.files[0]);
   };
   const handlePortfolioChange = (event) => {
      setPortfolio(event.target.files[0]);
   };
   const handleTranscriptChange = (event) => {
      setTranscript(event.target.files[0]);
   };
   const handleOtherDocumentsChange = (event) => {
      setOtherDocuments(event.target.files);
   };
   

   //Retrieves the user's profile information from the backend API using the user's ID
   const getProfile = async () => {
      const { data } = await axios.get(
      `http://localhost:8000/api/profile/` + userInfo.id
      );
      setProfile(data.profile);
   };

   const getJob = async () => {
      const { data } = await axios.get(`http://localhost:8000/api/job/${job_id}`);
      setJob(data[0]);
   }

   //Calls the getProfile function once when the component mounts
   useEffect(() => {
      getProfile();
      getJob();
   }, []);

   //Fills in the form fields with the user's profile information
   const autofillHandler = (e) => {

      setEmail(userInfo.email);
      setCity(profile.city)
      setName(userInfo.name);
      setExperience(profile.experience);
      setWork(profile.work);
      setEducation(profile.education);
      setVolunteering(profile.volunteering);
      setCourses(profile.courses);
      setProjects(profile.projects);
      setAwards(profile.awards);
      setLanguages(profile.languages);
      //setResume(profile.resume);
      //setCoverLetter(profile.coverLetter);
   }

   const submitHandler = (e) => {
      e.preventDefault()
      dispatch(create_job_application(job_id, email, name, telephone, city, provinceState, country, experience, work, education, volunteering, courses, projects, awards, languages, resume, coverLetter, recommendationLetter, portfolio, transcript, otherDocuments, profile)).then(
         (res) => {
           if (res.success) {
            setSubmitStatus(res.message);
           } else {
            setSubmitStatus("Failed to submit application. Please try again.");
         }
         }
       );

   }

   return (
      <div className='formBackground'>
         <div className='jobApplicationsPage'>
            <Button className='customButton ' variant='secondary' onClick={() => {navigate(-1)}}><TiArrowBack className='icon'/><span className='backText'>Back</span></Button>
            <div className='jobApplicationsPageForm'>
               <h1>Job Application Form</h1>
               <div className="jobInformation">
                  <h2>{job.title}</h2>
                  <h2>at</h2>
                  <h2>{job.company}</h2>
               </div>
               <Button className='customButton' id='autoFillButton' variant='secondary' onClick={autofillHandler}>Autofill using my profile information</Button>
               <Form className='jobApplicationForm'>
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
                     <p>If you are not currently employed, please enter 'N/A' in the text box provided below.</p>
                     <textarea className= 'form-control'
                     name="experience" id="experience" required value= {experience} placeholder='Enter your current employment information using the following format:&#13;&#10;Role&#13;&#10;Employer Name&#13;&#10;City, State/Province, Country&#13;&#10;Role Description' rows='5'
                     onChange={(e)=> setExperience(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <FormGroup >
                     <Label className='employmentHistory' for="work"><h3>Employment History</h3></Label>
                     <textarea  className= 'form-control'
                     name="work" id="work" required value = {work} placeholder='For each job entry you would like to include, enter the employment information using the following format:&#13;&#10;Role&#13;&#10;Employer Name&#13;&#10;City, State/Province, Country&#13;&#10;Role Description' rows='5'
                     onChange={(e)=> setWork(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <FormGroup>
                     <Label className='education' for="education"><h3>Education</h3></Label>
                     <textarea  className= 'form-control'
                     name="education" id="education" required value = {education} placeholder='For each education entry you would like to include, enter the information using the following format:&#13;&#10;Major / Area of Study&#13;&#10;Degree&#13;&#10;School Name&#13;&#10;City, State/Province, Country&#13;&#10;Additional Information' rows='6'
                     onChange={(e)=> setEducation(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <FormGroup>
                     <Label className='projects' for="projects"><h3>Personal Projects</h3></Label>
                     <p>If you do not have any personal projects that you would like to include, please enter 'N/A' in the text box provided below.</p>
                     <textarea  className= 'form-control'
                     name="projects" id="projects" required value = {projects} placeholder='For each project entry you would like to include, enter the information using the following format:&#13;&#10;Project Name&#13;&#10;Project Description' rows='3'
                     onChange={(e)=> setProjects(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <FormGroup>
                     <Label className='volunteering' for="volunteering"><h3>Volunteer Experience</h3></Label>
                     <p>If you do not have any volunteer experience that you would like to include, please enter 'N/A' in the text box provided below.</p>
                     <textarea  className= 'form-control'
                     name="volunteering" id="volunteering" value = {volunteering} placeholder='For each volunteer experience entry you would like to include, enter the information using the following format:&#13;&#10;Role&#13;&#10;Organization Name&#13;&#10;City, State/Province, Country&#13;&#10;Role Description' rows='5'
                     onChange={(e)=> setVolunteering(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <FormGroup>
                     <Label className='courses' for="courses"><h3>Courses</h3></Label>
                     <p>If you do not have any courses that you would like to include, please enter 'N/A' in the text box provided below.</p>
                     <textarea  className= 'form-control'
                     name="courses" id="courses" required value = {courses} placeholder='For each course entry you would like to include, enter the information using the following format:&#13;&#10;Course Name&#13;&#10;Organisation Name&#13;&#10;City, State/Province, Country&#13;&#10;Course Description' rows='5'
                     onChange={(e)=> setCourses(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <FormGroup>
                     <Label className='awards' for="awards"><h3>Awards</h3></Label>
                     <p>If you do not have any awards or certifications that you would like to include, please enter 'N/A' in the text box provided below.</p>
                     <textarea  className= 'form-control'
                     name="awards" id="awards" required value = {awards} placeholder='For each award entry you would like to include, enter the information using the following format:&#13;&#10;Award Name&#13;&#10;Organisation Name&#13;&#10;City, State/Province, Country&#13;&#10;Award Description' rows='5'
                     onChange={(e)=> setAwards(e.target.value)}/>
                  </FormGroup>
                  <hr/>               
                  <FormGroup>
                     <Label className='languages' for="languages"><h3>Languages</h3></Label>
                     <textarea  className= 'form-control'
                     name="languages" id="languages" required value = {languages} placeholder='For each language entry you would like to include, enter the information using the following format:&#13;&#10;Language&#13;&#10;Level of Fluency' rows='3'
                     onChange={(e)=> setLanguages(e.target.value)}/>
                  </FormGroup>
                  <hr/>
                  <h2>Documents</h2>
                  <FormGroup>
                     <Label className='resume' for="resume"><h3>Resume</h3></Label>
                     <Input type="file" name="resume" id="resume" onChange={handleResumeChange} required/>
                  </FormGroup>
                  <FormGroup>
                     <Label className='coverLetter' for="coverLetter"><h3>Cover Letter</h3></Label>
                     <Input type="file" name="coverLetter" id="coverLetter" onChange={handleCoverLetterChange} required/>
                  </FormGroup>
                  <FormGroup>
                     <Label className='recommendationLetter' for="recommendationLetter"><h3>Letter of Recommendation</h3></Label>
                     <Input type="file" name="recommendationLetter" id="recommendationLetter" onChange={handleRecommendationLetterChange} required/>
                  </FormGroup>
                  <FormGroup>
                     <Label className='portfolio' for="portfolio"><h3>Portfolio</h3></Label>
                     <Input type="file" name="portfolio" id="portfolio" onChange={handlePortfolioChange} required/>
                  </FormGroup>
                  <FormGroup>
                     <Label className='transcript' for="transcript"><h3>Transcript</h3></Label>
                     <Input type="file" name="transcript" id="transcript" onChange={handleTranscriptChange} required/>
                  </FormGroup>
                  <FormGroup>
                     <Label className='otherDocuments' for="otherDocuments"><h3>Other Documents</h3></Label>
                     <p>In this section, you can upload any extra documents that the employer may have requested in the job description, including but not limited to writing samples, certifications, proof of citizenship, and references.</p>
                     <Input type="file" name="otherDocuments" id="otherDocuments" onChange={handleOtherDocumentsChange} multiple/>
                  </FormGroup>
                  <hr/>
                  {submitStatus && (
                  <Alert className={`submitStatusAlert ${submitStatus.includes("successfully") ? "alert-success" : "alert-danger" }`} variant={ submitStatus.includes("successfully") ? "success" : "danger" } onClose={() => setSubmitStatus(null)}>
                     {" "}
                     {submitStatus}{" "}
                  </Alert>)}
                  <p>Before submitting your application, please verify that the information provided above is both accurate and genuine.</p>
                  <Button id='apply' className='customButton' type='submit' onClick={submitHandler}>Send Application Now</Button>
               </Form>
               
            </div>
         </div>
      </div>
   );
   };

export default JobApplication;
