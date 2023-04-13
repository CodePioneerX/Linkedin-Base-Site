import '../Assets/css/Settings.css';
import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import{ changePassword } from '../actions/userActions';
import JobAlerts from '../components/JobAlerts'

/*
More settings functionalities likely to be implemented. 
Currently, the Settings page only consists of a form which allows uses to reset their passwords, and allows them to manage their Job Alerts. 
*/
function Settings() {

  //password-storing variables
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(null);

  //user-storing variable
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  //on password-change form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword && newPassword.length >= 8){
      console.log("form submitted");

      dispatch(changePassword(userInfo.id, oldPassword, newPassword)).then(
        (res) => {
          if (res.success) {
            setPasswordChangeSuccess(res.message);
          } else {
            setPasswordChangeSuccess(
              "Failed to change password. \nPlease verify the information you have entered and try again.");
          }
        }
      );
    }
    
  };

    return (
      <div className='settingsPage'>
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
          <h1>Settings</h1>
          <hr style={{ width: "100%" }}/>
          <h3>Reset Password</h3>
        <FormGroup>
          <Label for="oldPassword">Old Password</Label>
          <Input type="password" name="password" id="oldPassword" className='pTextbox' placeholder="Enter current password" required
          value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)}/>
      </FormGroup>
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
      <Button id='submit' className='changePassword' type='submit'>
          Submit New Password
      </Button>
      </Form>
      
      </div>
      <div className='mb-5'></div>
      <div className='settingsForm mb-5'>
        <JobAlerts userId={userInfo.id}/>
      </div>
      </div>


      
    )
}

export default Settings;
