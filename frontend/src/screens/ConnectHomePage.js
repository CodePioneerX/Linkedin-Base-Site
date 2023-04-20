import React, {useState, useEffect} from 'react';
import { Button, Form, FormGroup, Input} from 'reactstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Message from '../components/Message';
import{ login } from '../actions/userActions';
import OfficeWorker from '../images/OfficeWorker.png';
import '../Assets/css/HomePage.css';


function ConnectHomePage() {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  

  const dispatch = useDispatch(); 
  const userLogin = useSelector(state => state.userLogin)
  const {error, userInfo} = userLogin

  const navigate = useNavigate();

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
   
    <div className='homeBackground'>
      <div id='homePageContents' className='homePageContents'> 
      <div id='loginForm' className='loginForm'>
        <hr/>
      <div id='welcomeTitle' className='welcomeTitle'><br/>Unlock Your <br/>Professional Potential</div>
      <hr/>
      <div>
        <img className='officeWorker' id='officeWorker' src={OfficeWorker}></img>
      </div>
      {error && <Message variant='danger'>{error}</Message>}
      <Form id='userLoginForm' className='userLoginForm' onSubmit={submitHandler}>
      <div id='loginTitleHome' className="loginTitleHome"><h2>Log in</h2></div>
        <FormGroup className='loginFormGroup'>
            <Input type="email" name="email" id="emailHome" placeholder="Enter your email..." required
            value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </FormGroup>
        <FormGroup className='loginFormGroup'>
            <Input type="password" name="password" id="passwordHome" placeholder="Enter your password..." required
            value={password} onChange={(e)=> setPassword(e.target.value)}/>
        </FormGroup>
        
        <Button id='submitLoginButton' className='submitLoginButton' type='submit' >
          Log in
        </Button>
        <div>
          <p className='Link' id='forgotPasswordLink'>Forgot password?&nbsp; <a href='#'> Click here</a> </p>
        </div>
      </Form>
      </div>
      <hr/>
      <div id='registerNow'>
      <p className="newToConnect">New to CONNECT? </p>
      <Button id='registerNowButton' className='submitLoginButton' href='register/' >
        Register Now
      </Button>
      </div>
      </div>
    </div>
  );
}

export default ConnectHomePage;