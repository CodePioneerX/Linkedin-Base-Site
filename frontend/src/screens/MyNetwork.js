import React, { Component } from 'react'
import Newsfeed from '../components/Newsfeed'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

export default class MyNetwork extends Component {
  render() {
    const userInfo =localStorage.getItem('userInfo');
    return (
      <div>
        {userInfo?
          <div>
          <h1>MyNetwork</h1>
          <Container>
          <Link to="/profileScreen" state={{data:4}}>
            <button>other user profile</button>
          </Link>
                <Link className='btn btn-primary' to='/create/post/' state={{from: "/network"}}>
                  Create a Post
                </Link>
          </Container>
          <Newsfeed/>
          </div>
          :
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
