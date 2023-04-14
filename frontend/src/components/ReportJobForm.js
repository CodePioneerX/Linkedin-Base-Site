import Button from 'react-bootstrap/Button';
import React, { useState, useEffect} from 'react'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { delete_job, update_job } from '../actions/jobActions'

// Define the ReportJobForm component
export const ReportJobForm = (job) => {

    // Define state variables for the title and content fields
    const [title, setTitle] = useState(job.job.title)
    const [company, setCompany] = useState(job.job.company)
    
    const [reportMessage, setReportMessage] = useState("")

    // Get the user login state from Redux
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;
    
     // Handle the submit event for the form
    const submitHandler = async (e) =>{
        e.preventDefault()
        
        try {
          // Set the headers for the HTTP request
          const config = {
            headers: {
              'Content-type': 'application/json',
            }
          }
          
          const { data } = await axios.post(
            `http://localhost:8000/api/jobs/report/`,
              { 'sender': userInfo.id,
                'job': job.job.id,
                'message': reportMessage },
              config
          )
          window.location.reload(false) 
        } catch(error) {
          console.log(error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message)
        }
        
         // Reload the page to reflect the updated job
        window.location.reload(false);
    }
    
    // Handle the cancel event for the form
    const cancelHandler = (e) => {
        e.preventDefault()
          // Reload the page to discard any changes made to the job
        window.location.reload(false)
    }
    
    return <div>
        <h2>Report Post</h2>
        <Form>
          <FormGroup className='mb-4'>
            <Label className='labelE' for="title" >Title</Label>
            <Input  name="title" placeholder={title} id="name" disabled />
          </FormGroup>
          <FormGroup className='mb-4'>
            <Label className='labelE' for="content">Content</Label>
            <Input  name="content" placeholder={content} id="content" disabled />
          </FormGroup>      
        </Form>
        
        <Form>
          <FormGroup>
            <Label className='labelE' for="report-message">Report Description</Label>
            <Input  type="textarea" style={{width : "100%" }} required name="report-message" 
                    id="report-message" placeholder="Please describe the reason that you are reporting this job." 
                    rows="5" onChange={(e)=> setReportMessage(e.target.value)}></Input>
          </FormGroup>
            <Row className='editButtonContainer'>
                <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                    <Button type='submit' className='editDeleteButton' onClick={submitHandler}>Submit Report</Button>
                </Col>
                <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                    <Button className='editCancelButton' onClick={cancelHandler}>Cancel</Button>
                </Col>
            </Row>
        </Form>
    </div>
}
