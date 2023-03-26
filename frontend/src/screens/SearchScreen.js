import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';

import Alert from 'react-bootstrap/Alert';

function SearchScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { name } = useParams();
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    if (name) {
        axios.get('http://localhost:8000/api/search-profile/'+name)
        .then(response => {
            setSearchResults(response.data);
        }
        )
        .catch(error => {
            console.log('error:',error);
        }
        )
    }
  }, [name]);

  


  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <div>
            <h1>Search Results for {name}</h1>
            <Container>
              {searchResults && searchResults.map((user) => (
                <Row>
                 
                  <ProfileCard name={user.name} title={user.title} about={user.about} image={user.image} />
                </Row>
                
              ))}
            </Container>
            
        </div>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
              
          </Alert>

        </Row>)}
      </Container>
  )

}
export default SearchScreen;
