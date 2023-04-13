import React, {useState, useEffect} from 'react';
import '../Assets/css/Login.css';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import{ login } from '../actions/userActions'


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

 useEffect(() => {
  if (userInfo) {
    navigate('/')
  }
  }, [ userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))

  }


  
  return (
   
    <div className='formBackground'>
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
            <Input type="email" name="email" id="email" placeholder="Enter your email" required
            value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </FormGroup>
        <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Enter your password" required
            value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </FormGroup>
        
        <Button id='submit' className='loginButton' type='submit' >
          Log in</Button>
          <div>
        <p className='loginP'>New to CONNECT?&nbsp;
        <a href='register/'> Register</a>
      </p>
        </div>
        <div>
        <p className='loginP'>Forget password?&nbsp;
        <a href='forgotpassword/'>Click here</a>
      </p>
        </div>
      </Form>
      </div>
   
  </div>
  );
}

export default LoginPage;