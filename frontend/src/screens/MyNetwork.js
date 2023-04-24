import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Newsfeed from '../components/Newsfeed'
import { EditPostForm } from '../components/EditPostForm';
import { ReportPostForm } from '../components/ReportPostForm';
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import ConnectionCard from '../components/ConnectionCard';
import axios from "axios";
import '../Assets/css/Network.css';


export const MyNetwork =()=> {

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [connectionList, setConnectionList] = useState("");
    const [pendingConnectionList, setPendingConnectionList] = useState("");
    const [pendingSentConnectionList, setPendingSentConnectionList] = useState("");
    const [unconnectedList, setUnconnectedList] = useState("");
    const [postEditor, setPostEditor] = useState(false);
    const [post, setPost] = useState('');
    const [reportEditor, setReportEditor] = useState(false)
    
    //retrieve the connection list from the back end
    const getConnections = async () => {
      try {
        const {data} = await axios.get(
          `http://insightwearai.sytes.net:8000/api/connections/accepted/${userInfo.id}`
        );
        setConnectionList(data);
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    };

    // retrieve list of pending (received) connections 
    const getPendingConnections = async () => {
      try {
        const {data} = await axios.get(
          `http://insightwearai.sytes.net:8000/api/connections/pending/${userInfo.id}`
        );
        setPendingConnectionList(data);
      } catch(error) {
      console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    };

    // retrieve list of pending (sent) connections
    const getPendingSentConnections = async () => {
      try {
      const {data} = await axios.get(
        `http://insightwearai.sytes.net:8000/api/connections/pending_sent/${userInfo.id}`
      );
      setPendingSentConnectionList(data);
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    };

    // retrieve list of possible connections (People You May Know)
    const getPossibleConnections = async () => {
      try {
        const {data} = await axios.get(
          `http://insightwearai.sytes.net:8000/api/connections/possible/${userInfo.id}`
        );
        setUnconnectedList(data);
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    }

    const postEditorMode = () => {
      setPostEditor(true)
    }
  
    const quitPostEditor = () => {
      setPostEditor(false)
    }

    const reportEditorMode = () => {
      setReportEditor(true)
    }
  
    const quitReportEditor = () => {
      setReportEditor(false)
    }

    useEffect(() => {
      getPendingConnections();
      getPendingSentConnections();
      getConnections();
      getPossibleConnections();
    }, []) 

    return (
      <div id='networkPage'>
        <div id='networkContainer'>
        {userInfo?
          <div className="mb-4">
          <Container>
            {(pendingConnectionList.length > 0 || pendingSentConnectionList.length > 0) &&
              <>
                <h2 className='heading'>Pending Connections</h2>
              </> 
            }
            {pendingConnectionList.length > 0 && 
            <>
              <h3 className='heading3'>Received</h3>
              {pendingConnectionList.map(connection => (
                <ConnectionCard key={connection.id} otherUserId={connection.sender} yourId={connection.recipient} status={connection.status} type={'received'}/>
              ))
              }
            </> 
            }
            {pendingSentConnectionList.length > 0 && 
            <>
              <h3 className='heading3' id='sentHeading'>Sent</h3>
              {pendingSentConnectionList.map(connection => (
                <ConnectionCard key={connection.id} otherUserId={connection.recipient} yourId={connection.sender} status={connection.status} type={'sent'}/>
              ))
              }
            </> 
            }
            <div>
              {connectionList.length > 0 && 
              <>
                <h2 className='heading'>My Connections</h2>
                {connectionList.map(connection => userInfo.id == connection.sender ? 
                <>
                  <ConnectionCard key={connection.id} otherUserId={connection.recipient} yourId={connection.sender} status={connection.status} type={'sent'}/>
                </> : 
                <>
                  <ConnectionCard key={connection.id} otherUserId={connection.sender} yourId={connection.recipient} status={connection.status} type={'received'}/>
                </>)} 
              </>
              }
              {unconnectedList.length > 0 && 
              <>
                <h2 className='heading'>People You May Know</h2>
                {unconnectedList.map(user => (
                  <ConnectionCard key={user.id} otherUserId={user.id} yourId={userInfo.id} type={'possible'}/>
                ))}
              </> 
              }
            </div>
          </Container>
          </div>
          :
          <Container className="justify-content-md-center padd">
            <Row>
              <Alert  className='alertLogin' key='primary' variant='primary'>
                  <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
              </Alert>
            </Row>
          </Container>
        }

        </div>
      </div>
    )
  
}
