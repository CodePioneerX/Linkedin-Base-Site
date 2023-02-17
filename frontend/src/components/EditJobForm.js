import Button from 'react-bootstrap/Button';
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { delete_job, update_job } from '../actions/userActions';

export const EditJobForm = (job) => {
    const [author, setAuthor] = useState(job.job.author)
    const [email, setEmail] = useState(job.job.author)
    const [title, setTitle] = useState(job.job.title)
    const [description, setDescription] = useState(job.job.description)
    const [remote, setRemote] = useState(job.job.remote)
    const [status, setStatus] = useState(job.job.status)
    const [active, setActive] = useState(job.job.active)
    const [company, setCompany] = useState(job.job.company)
    const [job_type, setJob_type] = useState(job.job.job_type)
    const [salary, setSalary] = useState(job.job.salary)
    const [location, setLocation] = useState(job.job.location)
    const [image, setImage] = useState(job.job.image)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;

    const dispatch = useDispatch();

    const submitHandler = (e)=>{
        e.preventDefault()
        
        dispatch(update_job(job.job.id, author, title, description, remote, active, company, job_type, image, salary, location))

        window.location.reload(false)
    }

    const cancelHandler = (e) => {
        e.preventDefault()

        window.location.reload(false)
    }

    const deleteHandler = (e) => {
        e.preventDefault()
        alert('Are you sure you want to delete this job?')
        dispatch(delete_job(job.job.id))
        window.location.reload(false)
    }
    
    return <div>
        <h2>Edit Your Job Listing</h2>
        <Form>
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
                    <Input name='job-title' id='form6Example3' value={title} onChange={(e)=> setTitle(e.target.value)} />
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='company'>Company</Label>
                    <Input name='company' id='form6Example5' value={company} onChange={(e)=> setCompany(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='description'>Description</Label>
                    <Input name='description' id='form6Example8' value={description} onChange={(e)=> setDescription(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='location'>Location</Label>
                    <Input name='location' id='form6Example4' value={location} onChange={(e)=> setLocation(e.target.value)}/>
                </Col>
                <Col>
                    <Label className='labelE' for='job-type'>Job Type (Full/Part-Time, etc.)</Label>
                    <Input name='job-type' id='form6Example6' value={job_type} onChange={(e)=> setJob_type(e.target.value)}/>
                </Col>
            </Row>
            <Row className='mb-4'>
                <Col>
                    <Label className='labelE' for='salary'>Salary</Label>
                    <Input id='form6Example7' label='Salary' value={salary} onChange={(e)=> setSalary(e.target.value)}/>    
                </Col>
                <Col>
                    <Label className='labelE' for='remote'>Remote?</Label>
                    <Input name='remote' type="checkbox" id='form6Example8' value={remote} onChange={(e)=> setRemote(true)}/>
                </Col>
                <Col>
                    <Label className='labelE' for='active'>Active?</Label>
                    <Input name='active' type='checkbox' id='form6Example8' value={active} onChange={(e)=> setActive(e.target.checked)}/>
                </Col>
            </Row>
        
            <Row className='editButtonContainer'>
                <Col xs={12} md={4}>
                    <Button type = 'submit' className='editSaveButton' onClick={submitHandler}> Save </Button>
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
