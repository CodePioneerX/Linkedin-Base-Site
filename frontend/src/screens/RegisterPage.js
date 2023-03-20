import React, {useState, useEffect} from 'react';
import '../Assets/css/Login.css';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import{ register, login } from '../actions/userActions'
import Alert from 'react-bootstrap/Alert';



function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const userRegister = useSelector(state => state.userRegister);
  const {error, loading, userInfo} = userRegister;

  const submitHandler = (e) => {
    e.preventDefault()
    if (password != confirmPassword) {
      setMessage('Passwords do not match.');
    } 
    else if (password.length < 8) {
      setMessage('Password should be at least 8 characters in length. ');
    }
    else {
        dispatch(register(name, email, password));
        setTimeout(setShowAlert, 1250, true);
    }
  }

  return (
   <div className='formBackground'>
    <div className='form'>
    <span>
      <Alert  className='warningDifferentPasswords' key='warning' variant='warning' show={Boolean((password!='') && (confirmPassword!='') && (password != confirmPassword))}>
        <h6>The passwords entered do not match!</h6>
      </Alert>
      <Alert  className='warningDifferentPasswords' id="infoPasswordLength" key='info' variant='warning' show={Boolean(password.length < 8 && password === confirmPassword)}>
        <h6>Be sure to choose a password that is at least 8 characters in length.</h6>
      </Alert>
    </span>
    <span className="logo">
        <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
    </span>
     <span className="title">Sign Up</span>
     {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <div>
      {showAlert &&
      <Alert  id='successMessage' className='success' key='success' variant='success'>
        <h6>An email will be sent to you from your CONNECT team. <br/><br/>Click the activation link in the email to activate your account and complete the registration process. <br/><br/>If you do not see an email from us in your email inbox, please check your spam folder or try registering again.</h6>
      </Alert>}
    </div>
    {!showAlert && <Form className='signupForm' onSubmit={submitHandler}>
    <FormGroup >
      <Label for="name">Name</Label>
          <Input type="name" name="name" id="name" placeholder="Enter your name" required
          value={name} onChange={(e)=> setName(e.target.value)}/>
      </FormGroup>
      <FormGroup >
      <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="Enter your email" required
          value={email} onChange={(e)=> setEmail(e.target.value)}/>
      </FormGroup>
      <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" name="password" id="password" placeholder="Confirm password" required
          value={password} onChange={(e)=> setPassword(e.target.value)}/>
      </FormGroup>
      <FormGroup>
          <Label for="password">Confirm Password</Label>
          <Input type="password" name="password" id="password2" placeholder="Enter your password" required
          value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
      </FormGroup>
      

      <Button className='loginButton' type='submit' >
        Register
      </Button>
        <div>
            <p className='loginP'>Already a member?&nbsp;
                <a href='/login'>Log in</a>
            </p>
       </div>
       <div>
       </div>
    </Form>}
    </div>
  </div>
  );
}

export default RegisterPage;