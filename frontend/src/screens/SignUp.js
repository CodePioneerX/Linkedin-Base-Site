import React from 'react';
import '../Assets/css/Login.css';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';

function SignUp() {
  return (
   <div className='formBackground'>
    <div className='form'>
    <span className="logo">
        <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
    </span>
     <span className="title">Sign Up</span>

    <Form className='signupForm'>

    <FormGroup >
      <Label for="firstName">First Name</Label>
          <Input type="fName" name="fName" id="firstName" placeholder="Enter your First Name" />
      </FormGroup>

      <FormGroup >
      <Label for="lastName">Last Name</Label>
          <Input type="lName" name="lName" id="lastName" placeholder="Enter your Last Name" />
      </FormGroup>
      
      <FormGroup >
      <Label for="userEmail">Email</Label>
          <Input type="email" name="email" id="userEmail" placeholder="Enter your email" />
      </FormGroup>
      <FormGroup>
          <Label for="userPassword">Password</Label>
          <Input type="password" name="password" id="userPassword" placeholder="Enter your password" />
      </FormGroup>

      <Button className='loginButton'>Sign Up</Button>

    </Form>
    </div>

  </div>
  );
}

export default SignUp;