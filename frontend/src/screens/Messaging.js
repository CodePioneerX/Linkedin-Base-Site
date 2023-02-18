import React, { Component } from 'react'
import {Container,Row} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';


export default class Messaging extends Component {
  render() {
    const userInfo =localStorage.getItem('userInfo');
    return (
      <div>
          {userInfo?
          <h1>Messaging</h1>:
          <Container className="justify-content-md-center padd">
          <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>
        </Container>
          }
          
      </div>
      
    )
  }
}
