import React, { Component, useState, useEffect } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Jobs from '../components/Jobs';
import Newsfeed from '../components/Newsfeed';
import { EditJobForm } from '../components/EditJobForm';
import { EditPostForm } from '../components/EditPostForm';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';

function Home() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [jobEditor, setJobEditor ] = useState('')
  const [job, setJob] = useState('')

  const [postEditor, setPostEditor] = useState(false)
  const [post, setPost] = useState('')

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

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <div>
            {jobEditor ? <EditJobForm edit={jobEditorMode} quit={quitJobEditor} job={job} /> : 
            postEditor ? <EditPostForm edit={postEditorMode} quitPostEditor={quitPostEditor} post={post} /> : 
            <>
              <Container>
                <Link className='btn btn-primary' to='/create/post/' state={{from: "/"}}>
                  Create a Post
                </Link>
              </Container>
              <Newsfeed id={userInfo.id} author={userInfo.email} edit={postEditorMode} quit={quitPostEditor} setpost={setPost} />
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
  )

}
export default Home;
