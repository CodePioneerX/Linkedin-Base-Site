import React, { useState, useEffect, Component } from 'react'
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBFile
  } from 'mdb-react-ui-kit';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import Jobs from '../components/Jobs';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import{ create_post } from '../actions/userActions'

function CreatePost() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [author, setAuthor] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState('')
  const [image, setImage] = useState('')



  const submitHandler = (e) => {
    e.preventDefault()
    // if (password != confirmPassword) {
    //     setMessage('Passwords do not match')
    // } else {
        
        dispatch(create_post(userInfo.email,title, content, image))
        console.log(userInfo)
        console.log("Job created with success")
        setStatus('success')
        
        
    
  }

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <Container className='padd'>
            <h1>Create a job listing</h1>
            <Form className='padd' onSubmit={submitHandler}>
                <MDBRow className='mb-4'>
                    <MDBCol>
                    <MDBInput id='form6Example1' label='Contact name'  value={author} onChange={(e)=> setAuthor(e.target.value)} />
                    </MDBCol>
                    <MDBCol>
                    <MDBInput id='form6Example2' label='Contact email'  value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    </MDBCol>
                </MDBRow>

                <MDBInput wrapperClass='mb-4' id='form6Example3' label='title'  value={title} onChange={(e)=> setTitle(e.target.value)} />
                <MDBInput wrapperClass='mb-4' id='form6Example8' rows={4} label='content'  value={content} onChange={(e)=> setContent(e.target.value)}/>
           
                <div className='mb-4'>
                    <MDBFile type="file" label='listing image' id='customFile'  onChange={(e)=> setImage(e.target.files[0])}/>

                </div>

                <MDBBtn className='mb-4 padd' type='submit' block>
                    Create a Post
                </MDBBtn>
            </Form>
          </Container>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
        
        
      </Container>
  )

}
export default CreatePost;