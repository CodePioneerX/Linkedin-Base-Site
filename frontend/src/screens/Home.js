import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Posts from '../components/Posts-old';
import Jobs from '../components/Jobs';
import Newsfeed from '../components/Newsfeed';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';

function Home() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <>
          <Container>
            <a className='btn btn-primary' href='/create/post' role='button'>
              Create a Post
            </a>
          </Container>
          <Newsfeed author={userInfo.email}/>
          <Jobs/>
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
export default Home;
