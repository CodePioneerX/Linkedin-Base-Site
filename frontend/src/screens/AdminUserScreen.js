import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Newsfeed from '../components/Newsfeed'
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
        const { data } = await axios.get(
          `http://localhost:8000/api/users/reported`
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
          {console.log(reportedUsersList)}
          {reportedUsersList.length > 0 && 
          <>
          {reportedUsersList.map(user => (
            <> 
              {user.isActive && 
              <div>
                <AdminUserCard key={user.id} userId={user.id}/>
              </div>}
            </>
          ))}
          </>}  
        </Container>  
      </div>}
    </div>
  )
}

export default AdminUserScreen;
