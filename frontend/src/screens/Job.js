import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Jobs from '../components/Jobs';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';

function Job() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <Container>
            <a className='btn btn-primary' href='/create/job' role='button'>
              Create a job listing
            </a>
          </Container>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
        
        <Jobs/>
      </Container>
  )

}
export default Job;
