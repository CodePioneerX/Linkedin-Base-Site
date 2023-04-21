// Import necessary components and functions
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import { Form, Label, Input, Row, Col } from 'reactstrap';
import { delete_job, update_job } from '../actions/jobActions';
import { salary_types, employment_terms, job_types } from '../constants/jobConstants';

// Define the EditJobForm component with the job object as a parameter
export const EditJobForm = (job) => {
    
    // Define state variables to store the job details
    const [author, setAuthor] = useState(job.job.author)
    const [email, setEmail] = useState(job.job.author)
    const [title, setTitle] = useState(job.job.title)
    const [description, setDescription] = useState(job.job.description)
    const [remote, setRemote] = useState(job.job.remote)
    const [status, setStatus] = useState(job.job.status)
    const [company, setCompany] = useState(job.job.company)
    const [location, setLocation] = useState(job.job.location)
    const [image, setImage] = useState(job.job.image)
    const [deadline, setDeadline] = useState(job.job.deadline)
    const [requiredDocs, setRequiredDocs] = useState(job.job.required_docs)
    const [salary, setSalary] = useState(job.job.salary)
    const [salaryType, setSalaryType] = useState(job.job.salary_type)
    const [listingType, setListingType] = useState(job.job.listing_type)
    const [link, setLink] = useState(job.job.link)
    const [employmentTerm, setEmploymentTerm] = useState(job.job.employment_term)
    const [jobType, setJobType] = useState(job.job.job_type)

    // Retrieve the user's login information from the Redux store
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;
    
    // Define the dispatch function to update or delete the job
    const dispatch = useDispatch();
    
    // Define a function to handle the submission of the job form
    const submitHandler = (e)=>{
        e.preventDefault()
        // Dispatch an action to update the job details
        dispatch(update_job(job.job.id, author, title, description, remote, status, company, image, location, deadline, requiredDocs, salary, salaryType, listingType, link, employmentTerm, jobType)).then(
            (res) => {
                if (res.success) {
                    window.location.reload(false)            
                } else {
                    alert(res.message)
                }
            }
        )
    }
    
    // Define a function to handle the cancellation of the job form
    const cancelHandler = (e) => {
        e.preventDefault()
        
         // Reload the page
        window.location.reload(false)
    }
    
    // Define a function to handle the deletion of the job
    const deleteHandler = (e) => {
        e.preventDefault()
        // Alert the user to confirm the deletion of the job
        alert('Are you sure you want to delete this job?')
        // Dispatch an action to delete the job
        dispatch(delete_job(job.job.id))
        // Reload the page
        window.location.reload(false)
    }

    // On page load, converts deadline to proper format
    // and sets the min value of the deadline input to current date
    useEffect(() => {
        var deadline_date = deadline.slice(0, 10)
        setDeadline(deadline_date)

        const date = new Date()
    
        let day = date.getDate();
        let month = date.getMonth() + 1;
        (month < 10) && (month = `0${month}`);
        let year = date.getFullYear();
        
        let today = `${year}-${month}-${day}`;
        
        document.getElementById("deadline").setAttribute("min", today);
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
    
    // Render the form for editing the job details
    return <div className='editPostContainer' style={{margin: "3%"}}>
        <h2 id='editJobListing2' style={{marginBottom: "5%"}}>Edit Your Job Listing</h2>
        <Form onSubmit={submitHandler}>
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
                    <Input name='description' type='textarea' rows='4' id='description' required={true} value={description} onChange={(e)=> setDescription(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='location'>Location</Label>
                    <Input name='location' id='location' required={true} value={location} onChange={(e)=> setLocation(e.target.value)}/>
                </Col>
                <Col>
                    <Label className='labelE' id='jobTypeLabel' for='job-type'>Job Type</Label>
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
                    <Label className='labelE' for='remote'><span>Remote?</span></Label>
                </Col>
                <Col style={{paddingLeft: "40px"}}>
                    <Input name='status' id='status' className='form-checkbox-input' type='checkbox' checked={status} onChange={(e)=> setStatus(!status)}/>
                    <Label className='labelE' for='status'><span>Active?</span></Label>
                </Col>
                <Col style={{paddingLeft: "40px"}}>
                    <Input name='listing-type' id='listing-type' className='form-checkbox-input' type='checkbox' checked={(listingType == 'INTERNAL') ? false : true} onChange={(e) => {
                        (listingType == 'INTERNAL') ? 
                        setListingType('EXTERNAL')
                        :
                        setListingType('INTERNAL')
                        }}/>
                    <Label className='labelE' for='listing-type'><span>External?</span></Label>
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
            </Row>
            {requiredDocs.map((doc, index) => (
                <Row key={index} className='mb-4'>
                    <Col xs='5'>
                        <Input name={doc.type} id={doc.type} className='form-doc-input' type='checkbox' checked={doc.required} onChange={() => updateRequiredDocs(doc.type)} />
                    </Col>
                    <Col xs='15'>
                        <Label className='labelE' id='docLabelE' style={{position:'relative', left:'-100px'}} for={doc.type}>{`${doc.type}`} Required</Label>
                    </Col>
                </Row>
            ))}
            <Row className='mb-4'></Row>
            <Row className='editButtonContainer'>
                <Col xs={12} md={4}>
                    <Button type = 'submit' className='editSaveButton'> Save </Button>
                </Col>
                <Col xs={12} md={4}>
                    <Button className='editCancelButton' onClick={cancelHandler}>Cancel</Button>
                </Col>
                <Col xs={12} md={4}>
                    <Button className='editDeleteButton' onClick={deleteHandler}>Delete</Button>
                </Col>
            </Row>
        </Form>
    </div>
} 
