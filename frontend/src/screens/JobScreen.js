import React, { useState } from 'react'
import {Container, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from 'react-router-dom'
import Job from '../components/Job';
import { EditJobForm } from '../components/EditJobForm';
import { ReportJobForm } from '../components/ReportJobForm';
import Alert from 'react-bootstrap/Alert';

function JobScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [jobEditor, setJobEditor ] = useState('')
  const [job, setJob] = useState('')

  const [jobReportEditor, setJobReportEditor] = useState(false)

  const location = useLocation()
  const { job_id } = location.state

  const navigate = useNavigate()

  const jobEditorMode = () => {
    setJobEditor(true)
  }

  const quitJobEditor = () => {
    setJobEditor(false)
  }

  const jobReportEditorMode = () => {
    setJobReportEditor(true)
  }

  const quitJobReportEditor = () => {
    setJobReportEditor(false)
  }

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
        <>
          <Button className='mb-4' variant='secondary' onClick={() => {navigate(-1)}}>Back</Button>
          <div>
            {jobEditor ? 
              <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} /> : 
            jobReportEditor ? <ReportJobForm edit={jobReportEditorMode} quitReportEditor={quitJobReportEditor} job={job}/> :
            <Container>
              <Job edit={jobEditorMode} quit={quitJobEditor} setjob={setJob} author={userInfo.id} job_id={job_id} navigate={navigate} report={jobReportEditorMode}/>
            </Container>}
          </div>
        </>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
      </Container>
  )

}
export default JobScreen;
