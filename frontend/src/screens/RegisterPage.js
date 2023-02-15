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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')

  const dispatch = useDispatch();
  const userRegister = useSelector(state => state.userRegister)
  const {error, loading, userInfo} = userRegister

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
        navigate('/login')
        alert('Your account has been successfully registered. \nAn email will be sent to you from your CONNECT team. Click the activation link in the email to activate your account and login.')
    }
  }, [userInfo, navigate]);


  const submitHandler = (e) => {
    e.preventDefault()
    if (password != confirmPassword) {
        setMessage('Passwords do not match')
    } else {
        dispatch(register(name, email, password))
    }
  }


  return (
   <div className='formBackground'>
    {/* <div className='homeContainer'> */}
    <div className='form'>
    <span>
      <Alert  className='warningDifferentPasswords' key='warning' variant='warning' show={Boolean((password!='') && (confirmPassword!='') && (password != confirmPassword))}>
        <h6>The passwords entered do not match!</h6>
      </Alert>
      </span>
    <span className="logo">
        <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
    </span>
     <span className="title">Sign Up</span>
     {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
    <Form className='signupForm' onSubmit={submitHandler}>
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
                <a href='/login'> Log in</a>
            </p>
       </div>
       <div>
      <p className='loginP'>Forgot password?&nbsp;
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

export default RegisterPage;