import React, { useState } from 'react'
import {Container, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import Jobs from '../components/Jobs';
import { EditJobForm } from '../components/EditJobForm';
import Alert from 'react-bootstrap/Alert';

function JobsScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [jobEditor, setJobEditor ] = useState('')
  const [job, setJob] = useState('')

  const navigate = useNavigate()

  const jobEditorMode = () => {
    setJobEditor(true)
  }

  const quitJobEditor = () => {
    setJobEditor(false)
  }

  return (
      <div style={{backgroundColor: "#44599d"}}>
        <Container className="justify-content-md-center padd" id='userHomePage'>
        {userInfo ? (
          <div>
            {jobEditor ? <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} /> :
            <>
              <Jobs edit={jobEditorMode} quit={quitJobEditor} setjob={setJob} author={userInfo.email}/>
          </>}
        </div>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
      </Container>
      </div>
  )

}
export default JobsScreen;
