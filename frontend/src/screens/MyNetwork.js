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
    
    //retrieve the connection list from the back end
    const getConnections = async () => {
      const {data} = await axios.get(
        `http://localhost:8000/api/connections/accepted/${userInfo.id}`
      );
      setConnectionList(data);
    };

    const getPendingConnections = async () => {
      const {data} = await axios.get(
        `http://localhost:8000/api/connections/pending/${userInfo.id}`
      );
      setPendingConnectionList(data);
    };

    const getPendingSentConnections = async () => {
      const {data} = await axios.get(
        `http://localhost:8000/api/connections/pending_sent/${userInfo.id}`
      );
      setPendingSentConnectionList(data);
    };

    useEffect(() => {
      getPendingConnections();
      getPendingSentConnections();
      getConnections();
    }, []) 

    return (
      <div>
        {userInfo?
          <div >
          <Container>
            {(pendingConnectionList.length > 0 || pendingSentConnectionList.length > 0) ?
            <>
              <h1 style={{marginTop:'1rem'}}>Pending Connections</h1>
            </> :
            <>
            </> }
            {pendingConnectionList.length > 0 ? 
            <>
              <h2 style={{marginTop:'1rem'}}>Received</h2>
              {pendingConnectionList.map(connection => (
                <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'received'}/>
              ))
              }
            </> : 
            <></>
            }
            {pendingSentConnectionList.length > 0 ? 
            <>
              <h2 style={{marginTop:'1rem'}}>Sent</h2>
              {pendingSentConnectionList.map(connection => (
                <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'sent'}/>
              ))
              }
            </> : 
            <></>
            }
            <div style={{marginBottom:'5rem'}}>
              <h1 style={{marginTop:'1rem'}}>My Connections</h1>
              {connectionList.length > 0 ? connectionList.map(connection => (
                <ConnectionCard key={connection.id} senderId={connection.sender} recipientId={connection.recipient} status={connection.status} type={'received'}/>
              ))
              : <></>
              }
              {this}
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
