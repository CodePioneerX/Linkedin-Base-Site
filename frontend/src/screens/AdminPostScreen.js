import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Newsfeed from '../components/Newsfeed'
import Message from'../components/Message'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import AdminPostCard from '../components/AdminPostCard';
import axios from "axios";
import '../Assets/css/Admin.css';

function AdminPostScreen() {   
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const updateToken = useSelector((state) => state.updateToken);
    const { loading, auth } = updateToken;

    const [reportedPostsList, setReportedPostsList] = useState("")

    const getReportedPosts = async () => {      
      try {
        const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${auth.access}`   
          }
        }
        const { data } = await axios.get(
          `http://insightwearai.sytes.net:8000/api/posts/reported`, config
        );
        setReportedPostsList( data );
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
        }
    };

    useEffect(() => {
      getReportedPosts();
    }, [auth])



  return (
    <div className="background">
      {userInfo && userInfo.isAdmin && 
      <div className="adminContainer">
        <Container>
          <h1 style={{marginTop:'1rem'}}>Reported Posts</h1>
          {reportedPostsList.length > 0 ? 
          <>
          {reportedPostsList.map(report => (
            <div key={report.id}> 
              <div>
                <AdminPostCard report={report}/>
              </div>
            </div>
          ))}
          </>
          :
          <>
            <Message>There are no pending Post Reports.</Message>
          </>}  
        </Container>  
      </div>}
    </div>
  )
}

export default AdminPostScreen;
