import React, {useState, useEffect} from 'react';
import { Container, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import{ changePassword } from '../actions/userActions';

function Settings() {

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch(); 

  const submitHandler = (e) => {
    e.preventDefault()
    console.log('form submitted')
    dispatch(changePassword(userInfo.id, oldPassword, newPassword))
    
  }
    return (
      <div >
        <h1>Settings</h1>
        <div className='changePasswordForm'>
        <span>
          <Alert  className='warningDifferentPasswords' key='warning' variant='warning' show={Boolean((newPassword!='') && (confirmNewPassword!='') && (newPassword != confirmNewPassword))}>
            <h6>The new passwords entered do not match!</h6>
          </Alert>
        </span>
        <h3>Change Password</h3>
        <Form className='changePasswordForm'>
        <FormGroup>
          <Label for="oldPassword">Old Password</Label>
          <Input type="password" name="password" id="oldPassword" placeholder="Enter current password" required
          value={oldPassword} onChange={(e)=> setOldPassword(e.target.value)}/>
      </FormGroup>
        <FormGroup>
          <Label for="newPassword">New Password</Label>
          <Input type="password" name="password" id="newPassword" placeholder="Enter new password" required
          value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
      </FormGroup>
      <FormGroup>
          <Label for="newPassword">Confirm New Password</Label>
          <Input type="password" name="password" id="newPassword2" placeholder="Renter your new password" required
          value={confirmNewPassword} onChange={(e)=> setConfirmNewPassword(e.target.value)}/>
      </FormGroup>
      </Form>
      <Button id='submit' className='changePassword' type='submit' onClick={submitHandler}>
          Submit Password Change
      </Button>
      </div>
      </div>


      
    )
}

export default Settings;