// Import necessary modules
import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import '../Assets/css/Login.css';
import { Form, Label, Input, Container, Row, Col } from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import{ create_job } from '../actions/jobActions'
import '../Assets/css/App.css'
import { required_docs_template, possible_docs, salary_types, employment_terms, job_types } from '../constants/jobConstants';

// Define CreateJobForm component
export const CreateJobForm = () => {
    // Get user information from Redux store
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
  
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    let required_docs = required_docs_template;

    // Define state variables for form input fields
    const [author, setAuthor] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [remote, setRemote] = useState('')
    const [status, setStatus] = useState('true')
    const [company, setCompany] = useState('')
    const [location, setLocation] = useState('')
    const [image, setImage] = useState('')
    const [deadline, setDeadline] = useState('')
    const [requiredDocs, setRequiredDocs] = useState(required_docs)
    const [salary, setSalary] = useState('')
    const [salaryType, setSalaryType] = useState('ANNUALLY')
    const [listingType, setListingType] = useState('INTERNAL')
    const [link, setLink] = useState('')
    const [employmentTerm, setEmploymentTerm] = useState('PERMANENT')
    const [jobType, setJobType] = useState('FULLTIME')
    
    // Define function to handle form submission
    const submitHandler = (e) => {
        e.preventDefault()
        
        // Dispatch action to create job listing
        dispatch(create_job(userInfo.email, email, title, description, remote, status, company, image, location, deadline, requiredDocs, salary, salaryType, listingType, link, employmentTerm, jobType)).then(
            (res) => {
                if (res.success) {
                    navigate('/jobs')
                    window.location.reload(false)
                } else {
                    alert(res.message)
                }
            }
        )
    }

    // on page load, set the min value of the deadline input to current date
    useEffect(() => {
        const date = new Date()
    
        let day = date.getDate();
        let month = date.getMonth() + 1;
        (month < 10) && (month = `0${month}`);
        let year = date.getFullYear();
        
        let today = `${year}-${month}-${day}`;
        
        document.getElementById("deadline").setAttribute("min", today);
        document.getElementById("deadline").setAttribute("value", today);

        setDeadline(today);
    }, []);


    // updates requiredDocs based on checkbox selection
    function updateRequiredDocs(document) {
        const newDocs = requiredDocs.map(doc => {
          if (doc.type === document) {
            return {
                ...doc, required: !(doc.required)
              };
          }
          else {
            return doc;
          }
        })
        setRequiredDocs(newDocs)
      }
    
    // Render form for creating job listing
    return (
    <Container className="justify-content-md-center padd">
        {userInfo ? (
            <Container>
            <h2>Create a Job Listing</h2>
            <Form onSubmit={submitHandler}>
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='contact-name'>Contact Name</Label>
                        <Input name='contact-name' disabled id='contact-name' label='Contact name' value={userLogin.userInfo.username} onChange={(e)=> setAuthor(e.target.value)} />
                    </Col>
                    <Col>
                        <Label className='labelE' for='contact-email'>Contact Email</Label>
                        <Input name='contact-email' disabled id='contact-email' value={userLogin.userInfo.email} onChange={(e)=> setEmail(e.target.value)}/>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='job-title'>Job Title</Label>
                        <Input name='job-title' id='job-title' required={true} value={title} onChange={(e)=> setTitle(e.target.value)} />
                    </Col>
                    <Col>
                        <Label className='labelE' for='company'>Company</Label>
                        <Input name='company' id='company' required={true} value={company} onChange={(e)=> setCompany(e.target.value)}/>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='description'>Description</Label>
                        <Input name='description' id='description' type='textarea' rows='4' required={true} value={description} onChange={(e)=> setDescription(e.target.value)}/>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='location'>Location</Label>
                        <Input name='location' id='location' required={true} value={location} onChange={(e)=> setLocation(e.target.value)}/>
                    </Col>
                    <Col>
                        <Label className='labelE' for='job-type'>Job Type</Label>
                        <Input name='job-type' id='job-type' type='select' required={true} value={jobType} onChange={(e)=> setJobType(e.target.value)}>
                            {job_types.map(type => (
                                <option key={type.value} value={type.value}>{type.name}</option>
                            ))}
                        </Input>
                    </Col>
                    <Col>
                        <Label className='labelE' for='employment-term'>Employment Term</Label>
                        <Input name='employment-term' id='employment-term' type='select' required={true} value={employmentTerm} onChange={(e)=> setEmploymentTerm(e.target.value)}>
                            {employment_terms.map(type => (
                                <option key={type.value} value={type.value}>{type.name}</option>
                            ))}
                        </Input>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='salary'>Salary</Label>
                        <Input name='salary' id='salary' type='number' label='Salary' required={true} value={salary} onChange={(e)=> setSalary(e.target.value)}/>    
                    </Col>
                    <Col>
                        <Label className='labelE' for='salary-type'>Salary Type</Label>
                        <Input name='salary-type' id='salary-type' type='select' required={true} value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
                            {salary_types.map(type => (
                                <option key={type.value} value={type.value}>{type.name}</option>
                            ))}
                        </Input>
                    </Col>
                    <Col>
                        <Label className='labelE' for='deadline'>Application Deadline</Label>
                        <Input name='deadline' id='deadline' type='date' required={true} value={deadline} onChange={(e)=> setDeadline(e.target.value)}/>
                    </Col>
                </Row>
                <Row className='mb-4'>
                    <Col style={{paddingLeft: "40px"}}>
                        <Input name='remote' id='remote' className='form-checkbox-input' type="checkbox" checked={remote} onChange={(e)=> setRemote(!remote)}/>
                        <Label className='labelE' for='remote'>Remote?</Label>
                    </Col>
                    <Col style={{paddingLeft: "40px"}}>
                        <Input name='active' id='active' className='form-checkbox-input' type='checkbox' checked={status} onChange={(e)=> setStatus(!status)}/>
                        <Label className='labelE' for='active'>Active?</Label>
                    </Col>
                    <Col style={{paddingLeft: "40px"}}>
                        <Input name='listing-type' id='listing-type' className='form-checkbox-input' type='checkbox' checked={(listingType == 'INTERNAL') ? false : true} onChange={(e) => {
                            (listingType == 'INTERNAL') ? 
                                setListingType('EXTERNAL')
                            :
                                setListingType('INTERNAL')
                            }}/>
                        <Label className='labelE' for='listing-type'>External?</Label>
                    </Col>
                </Row>
                {(listingType == 'EXTERNAL') &&  
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='link'>Link to Application</Label>
                        <Input name='link' id='link' required={true} value={link} onChange={(e) => setLink(e.target.value)}/>
                    </Col>
                </Row>}
                <Row className='mb-4'>
                    <Col>
                        <Label className='labelE' for='listing-image'>Listing Image</Label>
                        <Input name='listing-image' id='listing-image' type="file" onChange={(e)=> setImage(e.target.files[0])}/>
                    </Col>
                </Row >
                {possible_docs.map((doc, index) => (
                    <Row key={index}>
                        <Col xs='2'>
                            <Input className='form-doc-input' type='checkbox' name={doc} id={doc} checked={required_docs[doc]} onChange={() => updateRequiredDocs(doc)} />
                        </Col>
                        <Col xs='10'>
                            <Label className='labelE' style={{position:'relative', left:'-100px'}} for={doc}>{`${doc}`} Required</Label>
                        </Col>
                    </Row>
                ))}
                <Row className='mb-4'></Row>
                <Row className='mb-4'>
                    <Input className='profile-button' type='submit' label='Create a Job'/>
                </Row>
            </Form>
          </Container>) : (
          <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
        

    </Container>
        
    )

}

export default CreateJobForm;
