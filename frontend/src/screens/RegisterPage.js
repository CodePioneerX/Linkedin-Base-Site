import React, {useState, useEffect} from 'react';
import '../Assets/css/Login.css';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import{ register, login } from '../actions/userActions'



function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')

  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin)
  const {error, loading, userInfo} = userLogin

  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
        navigate('/')
    }

    if (status === 'success') {
      alert('Register success!')
      navigate('/login')
    }

    if (status != '') {
        setStatus('')
        // navigate('/')
    }
    
  }, [status, navigate]);


  const submitHandler = (e) => {
    e.preventDefault()
    if (password != confirmPassword) {
        setMessage('Passwords do not match')
    } else {
        
        
        dispatch(register(name, email, password))
        console.log(userInfo)
        console.log("register success")
        setStatus('success')
    }
  }


  return (

   <div className='formBackground'>
    {/* <div className='homeContainer'> */}
    <div className='form'>
    <span className="logo">
        <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
    </span>
     <span className="title">Sign Up</span>
     {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
    <Form className='signupForm' onSubmit={submitHandler}>
    <FormGroup >
      <Label for="name">Name</Label>
          <Input type="name" name="name" id="name" placeholder="Enter your name" 
          value={name} onChange={(e)=> setName(e.target.value)}/>
      </FormGroup>
      <FormGroup >
      <Label for="email">Email</Label>
          <Input type="email" name="email" id="email" placeholder="Enter your email" 
          value={email} onChange={(e)=> setEmail(e.target.value)}/>
      </FormGroup>
      <FormGroup>
          <Label for="password">Password</Label>
          <Input type="password" name="password" id="password" placeholder="Confirm password" 
          value={password} onChange={(e)=> setPassword(e.target.value)}/>
      </FormGroup>
      <FormGroup>
          <Label for="password">Confirm Password</Label>
          <Input type="password" name="password" id="password2" placeholder="Enter your password" 
          value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}/>
      </FormGroup>
      
      <Button className='loginButton' type='submit' >
        Register
      </Button>
        <div>
            <p className='loginP'>Already a member? 
                <a href='/login'> Log in</a>
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

export default RegisterPage;