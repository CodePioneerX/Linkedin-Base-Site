import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Newsfeed from '../components/Newsfeed'
import Message from'../components/Message'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import AdminUserCard from '../components/AdminUserCard';
import axios from "axios";

function AdminUserScreen() {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [reportedUsersList, setReportedUsersList] = useState("")

    const getReportedUsers = async () => {
      try {
        const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`   
          }
        }
        const { data } = await axios.get(
          `http://localhost:8000/api/users/reported`, config
        );
        setReportedUsersList( data );
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
        }
    };

    useEffect(() => {
      getReportedUsers();
    }, [])



  return (
    <div>
      {userInfo && userInfo.isAdmin && 
      <div>
        <Container>
          <h1 style={{marginTop:'1rem'}}>Reported Users</h1>
          {reportedUsersList.length > 0 ? 
          <>
          {reportedUsersList.map(user => (
            <div key={user.id}> 
              {user.isActive && 
              <div>
                <AdminUserCard userId={user.id}/>
              </div>}
            </div>
          ))}
          </>
          :
          <>
            <Message>There are no pending User Reports.</Message>
          </>}  
        </Container>  
      </div>}
    </div>
  )
}

export default AdminUserScreen;
