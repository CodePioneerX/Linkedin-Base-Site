import React, {useState, useEffect} from 'react';
import '../Assets/css/Login.css';
import { Container, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import{ login } from '../actions/userActions'
import {Link} from 'react-router-dom'


function LoginPage() {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin)
  const {error, loading, userInfo} = userLogin

  const navigate = useNavigate();


  function handleClick() {
    navigate('/register');
  }

  // note: navigate('/') causing infinite error loop - investigate

 useEffect(() => {
  if (userInfo) {
    // navigate('/')
  }
}, [ userInfo, navigate]);


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
    setTimeout(window.close, 50);
    window.open('/profile', '_blank', 'noreferrer');
    //window.close();
    //setTimeout(window.close, 8);
  }


  
  return (
   
    <div className='formBackground'>
      {/* <div className='homeContainer'> */}
      <div className='form'>
      <span className="logo">
          <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
      </span>
      <span className="title">Log in</span>
      {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
      <Form className='loginForm' onSubmit={submitHandler}>
        <FormGroup >
        <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="Enter your email" 
            value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Enter your password" 
            value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </FormGroup>
        
        <Button id='submit' className='loginButton' type='submit' >
          Submit</Button>
          <div>
        <p className='loginP'>New to Connect? 
        <a href='register/'> Register</a>
      </p>
        </div>
        <div>
        <p className='loginP'>Forget password? 
        <a href='#'> Click here</a>
      </p>
        </div>
      </Form>
      </div>
      {/* <div className='homeComponent'>
      <div>
      
      </div>
      </div> */}
      
      {/* </div> */}
   
  </div>
  );
}

export default LoginPage;