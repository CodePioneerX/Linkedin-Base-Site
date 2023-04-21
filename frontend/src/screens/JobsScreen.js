import React, { useState } from 'react'
import {Container, Row} from 'react-bootstrap';
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

  const [jobReportEditor, setJobReportEditor] = useState(false)

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
      <div style={{backgroundColor: "#44599d"}}>
        <Container className="justify-content-md-center padd" id='userHomePage'>
        {userInfo ? (
          <div>
            {jobEditor ? <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} /> :
            jobReportEditor ? <ReportJobForm edit={jobReportEditorMode} quitReportEditor={quitJobReportEditor} job={job}/> : 
            <>
              <Jobs edit={jobEditorMode} quit={quitJobEditor} setjob={setJob} author={userInfo.email} report={jobReportEditorMode}/>
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
