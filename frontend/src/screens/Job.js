import React, { Component , useState, useEffect } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Jobs from '../components/Jobs';
import CreateJobForm from '../components/CreateJobForm';
import { EditJobForm } from '../components/EditJobForm';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';

function Job() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [jobEditor, setJobEditor ] = useState('')
  const [job, setJob] = useState('')

  const jobEditorMode = () => {
    setJobEditor(true)
    // console.log("DEBUG : jobEditor: ", jobEditor)
  }

  const quitJobEditor = () => {
    // console.log("DEBUG : jobEditor: ", jobEditor)
    setJobEditor(false)
  }

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <div>
            {jobEditor ? 
              <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} /> : 
              <Container>
                <a className='btn btn-primary' href='/create/job' role='button'>
                  Create a job listing
                </a>
                <Jobs edit={jobEditorMode} quit={quitJobEditor} setjob={setJob} author={userInfo.email}/>
            </Container>}
          </div>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
      </Container>
  )

}
export default Job;
