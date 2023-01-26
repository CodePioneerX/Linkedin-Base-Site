import React from 'react';
import '../Assets/css/Login.css';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';

function LoginPage() {
  return (
   <div className='formBackground'>
    <div className='form'>
    <span className="logo">
        <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
    </span>
     <span className="title">Log in</span>

    <Form className='loginForm'>
      <FormGroup >
      <Label for="userEmail">Email</Label>
          <Input type="email" name="email" id="userEmail" placeholder="Enter your email" />
      </FormGroup>
      <FormGroup>
          <Label for="userPassword">Password</Label>
          <Input type="password" name="password" id="userPassword" placeholder="Enter your password" />
      </FormGroup>
      
      <Button className='loginButton'>Submit</Button>
     
      <p className='loginP'>New to Connect? 
      <a href='#'> Register</a>
      </p>
    </Form>
    </div>
  </div>
  );
}

export default LoginPage;