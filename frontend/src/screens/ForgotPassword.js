import React, {useState, useEffect} from 'react';
import '../Assets/css/Login.css';
import { Container, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Alert from 'react-bootstrap/Alert';
import{ forgotPassword } from '../actions/userActions';


function ForgotPassword() {
  
  const [email, setEmail] = useState('');
  const [emailSubmitSuccess, setEmailSubmitSuccess] = useState(null);

  const dispatch = useDispatch(); 
  const userLogin = useSelector(state => state.userLogin)
  const {error, loading, userInfo} = userLogin

  //on password-change form submission
  const submitHandler = (e) => {
    e.preventDefault();
    /**
     * dispatch(forgotPassword(email)).then(
        (res) => {
          if (res.success) {
            setEmailSubmitSuccess(res.message);
          } else {
            setEmailSubmitSuccess(
              "Failed to send email. Please try again.");
          }
        }
      );
     */
}
  return (
   
    <div className='formBackground'>
      <div className='form'>
      <span className="logo">
          <img src={process.env.PUBLIC_URL+'/logo.png'} alt="logo" ></img>
      </span>
      <span>
            {emailSubmitSuccess && (
            <Alert className={`passwordChangeAlert ${emailSubmitSuccess.includes("successfully") ? "alert-success" : "alert-danger" }`} variant={ emailSubmitSuccess.includes("successfully") ? "success" : "danger" } onClose={() => setEmailSubmitSuccess(null)}>
                {" "}
                {emailSubmitSuccess}{" "}
              </Alert>)}
          </span>
      <span className="title">Password Reset</span>
      {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
      <Form className='loginForm' onSubmit={submitHandler}>
      <h6>To reset your password, please provide your email address below. An email with instructions on how to proceed will be sent to you.</h6>
        <FormGroup >
        <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="Enter your email" required
            value={email} onChange={(e)=> setEmail(e.target.value)}/>
        </FormGroup>
        <Button id='submit' className='loginButton' type='submit' >
          Send Email
        </Button>
         
      </Form>
      </div>
   
  </div>
  );
}

export default ForgotPassword;