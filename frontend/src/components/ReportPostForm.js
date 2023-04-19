import Button from 'react-bootstrap/Button';
import React, { useState, useEffect} from 'react'
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Container } from 'react-bootstrap'
import '../Assets/css/Report.css';

// Define the ReportPostForm component
export const ReportPostForm = (post) => {

    // Define state variables for the title and content fields
    const [title, setTitle] = useState(post.post.title)
    const [content, setContent] = useState(post.post.content)
    
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
            `http://localhost:8000/api/posts/report/`,
              { 'sender': userInfo.id,
                'post': post.post.id,
                'message': reportMessage },
              config
          )
          window.location.reload(false) 
        } catch(error) {
          console.log(error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message)
        }
        
         // Reload the page to reflect the updated post
        window.location.reload(false);
    }
    
    // Handle the cancel event for the form
    const cancelHandler = (e) => {
        e.preventDefault()
          // Reload the page to discard any changes made to the post
        window.location.reload(false)
    }
    
    return (
      <Container className="reportContainer">
        <h2>Report Post</h2>
        <>
          <Row>
            <Col>
              <Label className='labelE'>Title</Label>
              <h4>{title}</h4>
            </Col>
          </Row>
          <Row>
            <Col>
              <Label className='labelE'>Content</Label>
              <p className="postContentPreview">{content}</p>
            </Col>
          </Row>      
        </>
        
        <Form>
          <FormGroup>
            <Label className='labelE' for="report-message">Report Description</Label>
            <Input  type="textarea" style={{width : "100%" }} required name="report-message" 
                    id="report-message" placeholder="Please describe the reason that you are reporting this post." 
                    rows="5" onChange={(e)=> setReportMessage(e.target.value)}></Input>
          </FormGroup>
            <Row className='editButtonContainer'>
                <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                    <Button type='submit' className="reportFormButton" onClick={submitHandler}>Submit Report</Button>
                </Col>
                <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                    <Button className="reportFormButton" onClick={cancelHandler}>Cancel</Button>
                </Col>
            </Row>
        </Form>
    </Container>
  )
}
