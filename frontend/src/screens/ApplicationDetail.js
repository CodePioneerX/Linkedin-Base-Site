import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { Container} from 'react-bootstrap';
import {  Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/JobApplication.css';
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
   <Container className="applicationDetailContainer">
   <Button className='mb-4' variant='secondary' onClick={() => {navigate(-1)}}>Back</Button>
  <h2>Applications Details</h2>
    <Container className="personalInfoContainer">
    <h2>Personal information</h2>
    <Row>
       <h5 className='personInfoH5'>Name: </h5> <h5>{applications.name}</h5>
    </Row>
    <Row>
        <h5 className='personInfoH5'>Email: </h5> <h5>{applications.email}</h5>
    </Row>  
    <Row>
        <h5 className='personInfoH5'>phone: </h5> <h5>{applications.phone}</h5>
    </Row> 
    <Row>
        <h5 className='personInfoH5'>city: </h5> <h5>{applications.city}</h5>
    </Row> 
    <Row>
        <h5 className='personInfoH5'>province: </h5> <h5>{applications.province}</h5>
    </Row> 
    <Row>
        <h5 className='personInfoH5'>country: </h5> <h5>{applications.country}</h5>
    </Row>  
    </Container>
    <Container className="personalInfoContainer">
        <h2>Current Employment</h2>
        <Row>
            <h5 className='InfoH5'>{applications.work}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Employment History</h2>
        <Row>
            <h5 className='InfoH5'>{applications.experience}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Education</h2>
        <Row>
            <h5 className='InfoH5'>{applications.education}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Personal Project</h2>
        <Row>
            <h5 className='InfoH5'>{applications.projects}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Volunteer Experience</h2>
        <Row>
            <h5 className='InfoH5'>{applications.volunteering}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Courses</h2>
        <Row>
            <h5 className='InfoH5'>{applications.courses}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Awards</h2>
        <Row>
            <h5 className='InfoH5'>{applications.awards}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Languages</h2>
        <Row>
            <h5 className='InfoH5'>{applications.languages}</h5>
        </Row>
    </Container>
    <Container className="personalInfoContainer">
        <h2>Documents</h2>
        <Row>
            <Col>
            <h5 className='personInfoH5'>Resumes：</h5>
            </Col>
            <Col>
            {applications.resume?<>
            <div>
                <a href={'http://localhost:8000'+applications.resume} download>View Resume</a>
            </div>
            </>:
            <p>N/A</p>
            }
            </Col>
        </Row>
        <Row>
            <Col>
            <h5 className='personInfoH5'>Cover Letter：</h5>
            </Col>
            <Col>
            {applications.cover_letter?<>
            <div>
                <a href={'http://localhost:8000'+applications.cover_letter} download>View Cover Letter</a>
            </div>
            </>:
            <p>N/A</p>
            }
            </Col>
        </Row>
        <Row>
            <Col>
            <h5 className='personInfoH5'>Letter of Recommendation：</h5>
            </Col>
            <Col>
            {applications.letter_of_recommendation?<>
            <div>
                <a href={'http://localhost:8000'+applications.letter_of_recommendation} download>View Letter of Recommendation</a>
            </div>
            </>:
            <p>N/A</p>
            }
            </Col>
        </Row>
        <Row>
            <Col>
            <h5 className='personInfoH5'>Portfolio：</h5>
            </Col>
            <Col>
            {applications.portfolio?<>
            <div>
                <a href={'http://localhost:8000'+applications.portfolio} download>View Portfolio</a>
            </div>
            </>:
            <p>N/A</p>
            }
            </Col>
        </Row>
        <Row>
            <Col>
            <h5 className='personInfoH5'>Transcript：</h5>
            </Col>
            <Col>
            {applications.transcript?<>
            <div>
                <a href={'http://localhost:8000'+applications.transcript} download>View Transcript</a>
            </div>
            </>:
            <p>N/A</p>
            }
            </Col>
        </Row>
        <Row>
            <Col>
            <h5 className='personInfoH5'>Other Documents：</h5>
            </Col>
            <Col>
            {applications.other_documents?<>
            <div>
                <a href={'http://localhost:8000'+applications.other_documents} download>View Other Documents</a>
            </div>
            </>:
            <p>N/A</p>
            }
            </Col>
        </Row>
    </Container>
    
   </Container>
);
};

export default ApplicationDetail;