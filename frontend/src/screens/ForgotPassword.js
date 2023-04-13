import React, { useState } from 'react'; 
import '../Assets/css/Login.css'; 
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'; 
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader'; 
import Message from '../components/Message'; 
import Alert from 'react-bootstrap/Alert'; 
import { forgotPasswordEmailRequest } from '../actions/userActions'; 

function ForgotPassword() {
  //initialize state with hooks
  const [email, setEmail] = useState('');
  const [emailSubmitSuccess, setEmailSubmitSuccess] = useState(null);
  const dispatch = useDispatch(); 
  const userLogin = useSelector(state => state.userLogin) 
  const { error, loading, userInfo } = userLogin 

  //on password-change form submission
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordEmailRequest(email.trim())).then( //call Redux action creator for password reset
      (res) => { //handle the response
        if (res.success) {
          setEmailSubmitSuccess(res.message);
        } else { 
          setEmailSubmitSuccess(
            "Failed to send email. Please try again."); 
        }
      }
    );
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
            </Alert>
          )}
        </span>
        <span className="title">Password Reset</span> 
        {error && <Message variant='danger'>{error}</Message>} {/* show any error message */}
        {loading && <Loader />} {/* show loader when loading */}
        <Form className='loginForm' onSubmit={submitHandler}> {/* password-reset form */}
          <h6>To reset your password, please provide your email address below. An email with instructions on how to proceed will be sent to you.</h6>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" id="email" placeholder="Enter your email" required
              value={email} onChange={(e)=> setEmail(e.target.value)}/>
          </FormGroup>
          <Button id='submit' className='loginButton' type='submit' > Send Email {/* submit button */} </Button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword; //export the component
