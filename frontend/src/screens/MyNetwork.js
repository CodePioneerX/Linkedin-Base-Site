import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Newsfeed from '../components/Newsfeed'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import ConnectionCard from '../components/ConnectionCard';
import axios from "axios";


export const MyNetwork =()=> {

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [connectionList, setConnectionList] = useState("");
    const [pendingConnectionList, setPendingConnectionList] = useState("");
    const [pendingSentConnectionList, setPendingSentConnectionList] = useState("");
    const [unconnectedList, setUnconnectedList] = useState("");
    
    //retrieve the connection list from the back end
    const getConnections = async () => {
      try {
        const {data} = await axios.get(
          `http://localhost:8000/api/connections/accepted/${userInfo.id}`
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
          `http://localhost:8000/api/connections/pending/${userInfo.id}`
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
        `http://localhost:8000/api/connections/pending_sent/${userInfo.id}`
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
          `http://localhost:8000/api/connections/possible/${userInfo.id}`
        );
        setUnconnectedList(data);
      } catch(error) {
        console.log(error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message)
      }
    }

    useEffect(() => {
      getPendingConnections();
      getPendingSentConnections();
      getConnections();
      getPossibleConnections();
    }, []) 

    return (
      <div>
        {userInfo?
          <div >
          <Container>
            {(pendingConnectionList.length > 0 || pendingSentConnectionList.length > 0) &&
              <>
                <h1 style={{marginTop:'1rem'}}>Pending Connections</h1>
              </> 
            }
            {pendingConnectionList.length > 0 && 
            <>
              <h2 style={{marginTop:'1rem'}}>Received</h2>
              {pendingConnectionList.map(connection => (
                <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'received'}/>
              ))
              }
            </> 
            }
            {pendingSentConnectionList.length > 0 && 
            <>
              <h2 style={{marginTop:'1rem'}}>Sent</h2>
              {pendingSentConnectionList.map(connection => (
                <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'sent'}/>
              ))
              }
            </> 
            }
            <div style={{marginBottom:'5rem'}}>
              {connectionList.length > 0 && 
              <>
                <h1 style={{marginTop:'1rem'}}>My Connections</h1>
                {connectionList.map(connection => userInfo.id == connection.sender ? 
                <>
                  <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'sent'}/>
                </> : 
                <>
                  <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'received'}/>
                </>)} 
              </>
              }
              {unconnectedList.length > 0 && 
              <>
                <h1 style={{marginTop:'1rem'}}>People You May Know</h1>
                {unconnectedList.map(user => (
                  <ConnectionCard recipientId={user.id} senderId={userInfo.id} type={'possible'}/>
                ))}
              </> 
              }
            </div>
          <hr/>
                <Link className='btn btn-primary' to='/create/post/' state={{from: "/network"}}>
                  Create a Post
                </Link>
          </Container>
          <Newsfeed/>
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
    )
  
}
