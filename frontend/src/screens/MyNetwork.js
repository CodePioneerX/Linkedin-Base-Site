import React, { useState, useEffect } from 'react'
import Newsfeed from '../components/Newsfeed'
import { Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import ConnectionCard from '../components/ConnectionCard';
import axios from "axios";


export const MyNetwork =()=> {

    const userInfo =localStorage.getItem('userInfo');
    const [connectionList, setConnectionList] = useState("");
    
    //retrieve the connection list from the back end
    const getProfile = async () => {
      const {data} = await axios.get(
        `http://localhost:8000/api/profile/` + userInfo.userId
      );
      setConnectionList(data);
      
    };

    return (
      <div>
        {userInfo?
          <div >
          <Container>
            <div style={{marginBottom:'5rem'}}>
          <h1 style={{marginTop:'1rem'}}>My Connection</h1>

          <ConnectionCard userId={15}/>


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
