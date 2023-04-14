import React, { useState } from 'react'
import {Container, Row} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import Jobs from '../components/Jobs';
import { EditJobForm } from '../components/EditJobForm';
import { ReportJobForm } from '../components/ReportJobForm';
import Alert from 'react-bootstrap/Alert';

function JobsScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [jobEditor, setJobEditor ] = useState('')
  const [job, setJob] = useState('')

  const [reportEditor, setReportEditor] = useState(false)

  const navigate = useNavigate()

  const jobEditorMode = () => {
    setJobEditor(true)
  }

  const quitJobEditor = () => {
    setJobEditor(false)
  }

  const reportEditorMode = () => {
    setReportEditor(true)
  }

  const quitReportEditor = () => {
    setReportEditor(false)
  }

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <div>
            {jobEditor ? 
              <>
                <Button className='mb-4' variant='secondary' onClick={() => {navigate(-1)}}>Back</Button>
                <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} />  
              </>:
              reportEditor ? <ReportJobForm edit={reportEditorMode} quitReportEditor={quitReportEditor} job={job}/> :
              <Container>
                <a className='btn btn-primary' href='/create/job' role='button'>
                  Create a job listing
                </a>
                <Jobs edit={jobEditorMode} quit={quitJobEditor} setjob={setJob} author={userInfo.email} report={reportEditorMode}/>
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
export default JobsScreen;
