import React, { Component } from 'react'
import {Container,Row} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import MessagesSettings from "./msgsettings.jsx";
import Body from "./body.jsx";

export default class Messaging extends Component {
  constructor (props) {
		// Calls the parent constructor.
		super (props);
		// Global attributes.
		this.state = {
			modal: false
		};
	}

  render() {
    const userInfo =localStorage.getItem('userInfo');
    return (
      <div>
          {userInfo?
          <h1></h1>:
          <Container className="justify-content-md-center padd">
          <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>
        </Container>
          }
          
          <div className = "chat-simulation">

          <Body onSettings = {() => this.setState ({modal: true})}/>

          {this.state.modal && <MessagesSettings onClosed = {() => this.setState ({modal: false})}/>}
        </div>
      </div>
      
    )
  }
}
