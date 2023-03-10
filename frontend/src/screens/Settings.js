import '../Assets/css/Settings.css';
import React, {useState, useEffect} from 'react';
import { Container, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import{ changePassword } from '../actions/userActions';

/*
More settings functionalities likely to be implemented. 
Currently, the Settings page only consists of a form which allows uses to reset their passwords. 
*/
function Settings() {

  //password-storing variables 
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  //user-storing variable 
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch(); 

  //on password-change form submission
  const submitHandler = (e) => {
    e.preventDefault()
    console.log('form submitted')
    dispatch(changePassword(userInfo.id, oldPassword, newPassword))
    
  }
    return (
      <div >
        <h1>Settings</h1>
        <div className='settingsForm'>
        
        <Form className='changePasswordForm' onSubmit={submitHandler}>
        <span>
          <Alert id='warningMessage' className='warningDifferentPasswords' key='warning' variant='warning' show={Boolean((newPassword!='') && (confirmNewPassword!='') && (newPassword != confirmNewPassword))}>
            <h6>The new passwords entered do not match!</h6>
          </Alert>
        </span>
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
      <Button id='submit' className='changePassword' type='submit' onCli>
          Submit New Password
      </Button>
      </Form>
      
      </div>
      </div>


      
    )
}

export default Settings;