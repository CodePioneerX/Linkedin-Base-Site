import '../Assets/css/Settings.css';
import React, {useState, useEffect} from 'react';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import{ changePasswordForReset } from '../actions/userActions';
import { useParams } from 'react-router-dom';
import { decode } from 'base-64';


/*
More settings functionalities likely to be implemented. 
Currently, the Settings page only consists of a form which allows uses to reset their passwords. 
*/
function PasswordReset() {

  //password-storing variables
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  //user-storing variable
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const { uidb64, token } = useParams();
  const uid = decode(uidb64);

  //on password-change form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword && newPassword.length >= 8){
      console.log("form submitted");

      dispatch(changePasswordForReset(uid, newPassword)).then(
        (res) => {
          if (res.success) {
            setPasswordChangeSuccess(res.message);
          } else {
            setPasswordChangeSuccess(
              "Failed to change password. \nPlease verify the information you have entered and try again.");
          }
        }
      );
      setSubmitted(true);
    }
  };


  return (
    <div>
    <h1></h1>
    <div className='settingsForm'>
      <Form className='changePasswordForm' onSubmit={submitHandler}>
        <span>
          <Alert id='warningMessage'className='warningDifferentPasswords' key='warning' variant='warning' show={Boolean( newPassword !== '' && confirmNewPassword !== '' && newPassword !== confirmNewPassword )}>
            <h6>The password entered in 'New Password' does not match the one entered in 'Confirm New Password'.</h6>
          </Alert>
          <Alert  className='warningDifferentPasswords' id="infoPasswordLength" key='info' variant='warning' show={Boolean(newPassword.length < 8 && newPassword.length > 0 && newPassword === confirmNewPassword)}>
            <h6>Be sure to choose a password that is at least 8 characters in length.</h6>
          </Alert>
        </span>
          <span>
          {passwordChangeSuccess && (
          <Alert className={`passwordChangeAlert ${passwordChangeSuccess.includes("successfully") ? "alert-success" : "alert-danger" }`} variant={ passwordChangeSuccess.includes("successfully") ? "success" : "danger" } onClose={() => setPasswordChangeSuccess(null)}>
              {" "}
              {passwordChangeSuccess}{" "}
            </Alert>)}
        </span>
        <h3>Reset Password</h3>
      <FormGroup>
        <Label for="newPassword">New Password</Label>
        <Input type="password" name="password" id="newPassword" className='pTextbox' placeholder="Enter new password" required
        value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
    </FormGroup>
    <FormGroup>
        <Label for="newPassword">Confirm New Password</Label>
        <Input type="password" name="password" id="newPassword2" className='pTextbox' placeholder="Renter your new password" required
        value={confirmNewPassword} onChange={(e)=> setConfirmNewPassword(e.target.value)}/>
    </FormGroup>
    
    {!submitted && (<Button id='submit' className='changePassword' type='submit'>
        Submit New Password
    </Button>)}
    {submitted && (<Button id='submit' className='changePassword' href='/login'>
        Go to Log In
    </Button>)}
    </Form>
    
    </div>
    </div>


    
  )
}

export default PasswordReset;