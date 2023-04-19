import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Jobs from '../components/Jobs';
import Newsfeed from '../components/Newsfeed';
import { EditJobForm } from '../components/EditJobForm';
import { EditPostForm } from '../components/EditPostForm';
import { ReportPostForm } from '../components/ReportPostForm';
import { ReportJobForm } from '../components/ReportJobForm';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import { get_notifications } from "../actions/notificationActions";
import '../Assets/css/HomePage.css';

function Home() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [jobEditor, setJobEditor ] = useState('')
  const [job, setJob] = useState('')

  const [postEditor, setPostEditor] = useState(false)
  const [post, setPost] = useState('')

  const [reportEditor, setReportEditor] = useState(false)

  const [jobReportEditor, setJobReportEditor] = useState(false)

  const dispatch = useDispatch();

  const jobEditorMode = () => {
    setJobEditor(true)
  }

  const quitJobEditor = () => {
    setJobEditor(false)
  }

  const postEditorMode = () => {
    setPostEditor(true)
  }

  const quitPostEditor = () => {
    setPostEditor(false)
  }

  const reportEditorMode = () => {
    setReportEditor(true)
  }

  const quitReportEditor = () => {
    setReportEditor(false)
  }

  const jobReportEditorMode = () => {
    setJobReportEditor(true)
  }

  const quitJobReportEditor = () => {
    setJobReportEditor(false)
  }

  useEffect(() => {
    dispatch(get_notifications(userInfo.id))
  })

  return (
    <div style={{backgroundColor: "#44599d"}}>
      <Container className="justify-content-md-center padd" id='userHomePage'>
        {userInfo ? (
          <div>
            {jobEditor ? <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} /> : 
            postEditor ? <EditPostForm edit={postEditorMode} quitPostEditor={quitPostEditor} post={post} /> : 
            reportEditor ? <ReportPostForm edit={reportEditorMode} quitReportEditor={quitReportEditor} post={post}/> :
            jobReportEditor ? <ReportJobForm edit={jobReportEditorMode} quitReportEditor={quitJobReportEditor} job={job}/> :
            <>
              <Newsfeed id={userInfo.id} author={userInfo.id} edit={postEditorMode} quit={quitPostEditor} setpost={setPost}  report={reportEditorMode}/>
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
export default Home;
