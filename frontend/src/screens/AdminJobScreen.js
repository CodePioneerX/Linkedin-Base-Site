import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Newsfeed from '../components/Newsfeed'
import Message from'../components/Message'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import AdminJobCard from '../components/AdminJobCard';
import axios from "axios";
import '../Assets/css/Admin.css';

function AdminJobScreen() {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const updateToken = useSelector((state) => state.updateToken);
    const { loading, auth } = updateToken;

    const [reportedJobsList, setReportedJobsList] = useState("")

    const getReportedJobs = async () => {
      try {
        const config = {
          headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${auth.access}`   
          }
        }
        const { data } = await axios.get(
          `http://insightwearai.sytes.net:8000/api/jobs/reported`, config
        );
        setReportedJobsList( data );
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
        }
    };

    useEffect(() => {
      getReportedJobs();
    }, [auth])



  return (
    <div className="background">
      {userInfo && userInfo.isAdmin && 
      <div className="adminContainer">
        <Container>
          <h1 style={{marginTop:'1rem'}}>Reported Jobs</h1>
          {reportedJobsList.length > 0 ? 
          <>
          {reportedJobsList.map(report => (
            <div key={report.id}> 
              <div>
                <AdminJobCard report={report}/>
              </div>
            </div>
          ))}
          </>
          :
          <>
            <Message>There are no pending Job Reports.</Message>
          </>}  
        </Container>  
      </div>}
    </div>
  )
}

export default AdminJobScreen;
