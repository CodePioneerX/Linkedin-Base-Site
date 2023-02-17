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
import { useNavigate } from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import Jobs from '../components/Jobs';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import{ create_job } from '../actions/userActions'

function CreateJob() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [author, setAuthor] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [remote, setRemote] = useState('')
  const [status, setStatus] = useState('')
  const [active, setActive] = useState('')
  const [company, setCompany] = useState('')
  const [job_type, setJob_type] = useState('')
  const [salary, setSalary] = useState('')
  const [location, setLocation] = useState('')
  const [image, setImage] = useState('')



  const submitHandler = (e) => {
    e.preventDefault()
      // setAuthor(userInfo.email)
      console.log('author: ', author)
      // console.log('userInfo.email: ', userInfo.email)
      // console.log(author, email, title, description,remote, active, company,job_type, image,salary,location)
      
      dispatch(create_job(userInfo.email, email, title, description, remote, active, company, job_type, image,salary, location))
      // console.log(userInfo)
      // console.log("Job created with success")
      setStatus('success')

      navigate('/jobs/')
        
        
    
  }

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <Container className='padd'>
            <h1>Create a Job Listing</h1>
            <Form className='padd' onSubmit={submitHandler}>
                <MDBRow className='mb-4'>
                    <MDBCol>
                      <MDBInput disabled id='form6Example1' label='Contact name' value={userLogin.userInfo.username} onChange={(e)=> setAuthor(e.target.value)} />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput disabled id='form6Example2' label='Contact email'  value={userLogin.userInfo.email} onChange={(e)=> setEmail(e.target.value)}/>
                    </MDBCol>
                </MDBRow>

                <MDBInput wrapperClass='mb-4' id='form6Example3' label='Job Title'  value={title} onChange={(e)=> setTitle(e.target.value)} />
                <MDBInput wrapperClass='mb-4' type='form6Example11' id='form6Example5' label='Company'  value={company} onChange={(e)=> setCompany(e.target.value)}/>
                <MDBInput wrapperClass='mb-4' id='form6Example8' rows={4} label='Description'  value={description} onChange={(e)=> setDescription(e.target.value)}/>
                <MDBInput wrapperClass='mb-4' id='form6Example4' label='Location'  value={location} onChange={(e)=> setLocation(e.target.value)}/>
                <MDBInput wrapperClass='mb-4' type='form6Example10' id='form6Example6' label='Job Type (Contract, Part-Time, etc.)'  value={job_type} onChange={(e)=> setJob_type(e.target.value)}/>
                <MDBInput wrapperClass='mb-4' textarea id='form6Example7' label='Salary' value={salary} onChange={(e)=> setSalary(e.target.value)}/>

                <MDBCheckbox
                    wrapperClass='d-flex mb-4'
                    id='form6Example8'
                    label='remote?'
                    
                    checked={remote} 
                    onChange={(e)=> setRemote(true)}
                />

              <MDBCheckbox
                    wrapperClass='d-flex mb-4'
                    id='form6Example8'
                    label='active?'
                    //defaultChecked
                    checked={active} 
                    onChange={(e)=> setActive(e.target.checked)}
                />
                <div className='mb-4'>
                    <MDBFile type="file" label='listing image' id='customFile'  onChange={(e)=> setImage(e.target.files[0])}/>

                </div>

                <MDBBtn className='mb-4 padd' type='submit' block>
                    Create a job
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
export default CreateJob;
