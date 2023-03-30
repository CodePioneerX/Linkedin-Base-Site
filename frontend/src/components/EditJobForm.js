// Import necessary components and functions
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { delete_job, update_job } from '../actions/jobActions';

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
    const [job_type, setJob_type] = useState(job.job.job_type)
    const [salary, setSalary] = useState(job.job.salary)
    const [location, setLocation] = useState(job.job.location)
    const [image, setImage] = useState(job.job.image)
    const [deadline, setDeadline] = useState(job.job.deadline)
    const [requiredDocs, setRequiredDocs] = useState(job.job.required_docs)
    const [listingType, setListingType] = useState(job.job.listing_type)
    const [link, setLink] = useState(job.job.link)

    // Retrieve the user's login information from the Redux store
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;
    
    // Define the dispatch function to update or delete the job
    const dispatch = useDispatch();
    
    // Define a function to handle the submission of the job form
    const submitHandler = (e)=>{
        e.preventDefault()
        console.log(requiredDocs)
        // Dispatch an action to update the job details
        dispatch(update_job(job.job.id, author, title, description, remote, status, company, job_type, image, salary, location, deadline, requiredDocs, listingType, link)).then(
            (res) => {
                if (res.success) {
                    window.location.reload(false)            
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
        
        document.getElementById("deadlineInput").setAttribute("min", today);
        console.log(requiredDocs)
        console.log(listingType)
    }, []);

    // updates requiredDocs based on checkbox selection
    function updateRequiredDocs(document) {
        const newDocs = requiredDocs.map(doc => {
          if (doc.type !== document) {
            return doc;
          }
          if (doc.type === document) {
            return {
              ...doc, required: !(doc.required)
            };
          }
        })
        setRequiredDocs(newDocs)
      }
    
    // Render the form for editing the job details
    return <div>
        <h2>Edit Your Job Listing</h2>
        <Form onSubmit={submitHandler}>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='contact-name'>Contact Name</Label>
                    <Input name='contact-name' disabled id='form6Example1' value={userLogin.userInfo.username} onChange={(e)=> setAuthor(e.target.value)} />
                </Col>
                <Col>
                    <Label className='labelE' for='contact-email'>Contact Email</Label>
                    <Input name='contact-email' disabled id='form6Example2' value={userLogin.userInfo.username} onChange={(e)=> setEmail(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='job-title'>Job Title</Label>
                    <Input name='job-title' id='form6Example3' required='true' value={title} onChange={(e)=> setTitle(e.target.value)} />
                </Col>
                <Col>
                    <Label className='labelE' for='company'>Company</Label>
                    <Input name='company' id='form6Example5' required='true' value={company} onChange={(e)=> setCompany(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='description'>Description</Label>
                    <Input name='description' type='textarea' rows='4' id='form6Example8' required='true' value={description} onChange={(e)=> setDescription(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='location'>Location</Label>
                    <Input name='location' id='form6Example4' required='true' value={location} onChange={(e)=> setLocation(e.target.value)}/>
                </Col>
                <Col>
                    <Label className='labelE' for='job-type'>Job Type (Full/Part-Time, etc.)</Label>
                    <Input name='job-type' id='form6Example6' required='true' value={job_type} onChange={(e)=> setJob_type(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='salary'>Salary</Label>
                    <Input id='form6Example7' type='number' label='Salary' required='true' value={salary} onChange={(e)=> setSalary(e.target.value)}/>    
                </Col>
                <Col>
                    <Label className='labelE' for='deadline'>Application Deadline</Label>
                    <Input type='date' id='deadlineInput' required='true' value={deadline} onChange={(e)=> setDeadline(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col style={{paddingLeft: "40px"}}>
                    <Input name='remote' className='form-checkbox-input' type="checkbox"  id='form6Example81'  checked={remote} onChange={(e)=> setRemote(!remote)}/>
                    <Label className='labelE' for='remote'>Remote?</Label>
                </Col>
                <Col style={{paddingLeft: "40px"}}>
                    <Input name='status' className='form-checkbox-input' type='checkbox' id='form6Example8' checked={status} onChange={(e)=> setStatus(!status)}/>
                    <Label className='labelE' for='status'>Active?</Label>
                </Col>
                <Col style={{paddingLeft: "40px"}}>
                    <Input name='listing-type' className='form-checkbox-input' type='checkbox' id='form6Example82' checked={(listingType == 'INTERNAL') ? false : true} onChange={(e) => {
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
                        <Input name='link' id='form6Example4' required='true' value={link} onChange={(e) => setLink(e.target.value)}/>
                    </Col>
            </Row>}
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='listing-image'>Listing Image</Label>
                    <Input name='listing-image' type="file" id='customFile' onChange={(e)=> setImage(e.target.files[0])}/>
                </Col>
            </Row>
            {requiredDocs.map((doc, index) => (
                <Row key={index}>
                    <Col xs='2'>
                        <Input className='form-doc-input' type='checkbox' name={doc.type} checked={doc.required} onChange={() => updateRequiredDocs(doc.type)} />
                    </Col>
                    <Col xs='10'>
                        <Label className='labelE' style={{position:'relative', left:'-100px'}} for={doc.type}>{`${doc.type}`} Required</Label>
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
