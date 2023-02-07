import React, { useState, useEffect} from 'react'
import axios from 'axios';
import {Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import Posts from '../components/Posts-old';
import { useNavigate} from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


function ViewProfile() {


  const [profile, setProfile] = useState('')

  const dispatch = useDispatch(); 
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  
  console.log("userLogin: ",userLogin)
  console.log("userInfo: ",userInfo)


  useEffect(() => {
    if (!userInfo) {
      navigate('/')
    }
  }, [ userInfo, navigate]);

  
  const getProfile= async () => {
    const {data} = await axios.get(`http://localhost:8000/api/profile/`+userInfo.id)
    setProfile(data)}

  useEffect(() => {
   //make request to get profile details
    getProfile();
  }, []);






  
    
    return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
        <div className="profile-page">
        <Row>
          <Col>
            <div className="profile-header">
              <img src={profile.image} alt="Profile" class="profile-image padd_small" />
            </div>
          </Col>
          <Col>
          <div className="profile-header padd_small">
            <h1 className="profile-name padd_small">{profile.name}</h1>
            <h4 className="profile-title padd_small">{profile.title}</h4>
            <h6 className="profile-city">{profile.city}</h6>
            <h2 className='padd_small'>About Me</h2>
            <p className='about-me'>{profile.about}</p>
            <h2 className="padd_small">Experience</h2>
            <ul className="experience-list">
            {profile.experience}
              {/* {profile.experience.map(exp => (
                <li key={exp.id}>
                  <h3>{exp.title} at {exp.company}</h3>
                  <p>{exp.description}</p>
                </li>
              ))} */}
            </ul>
            <h2 className="padd_small">Education</h2>
            <ul className="education-list">
              {profile.education}
            </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="profile-content">
          <Container className="justify-content-md-center pd-5 padd_small">

          </Container>
          </div>
        </Row>
        <Row>
          <Posts/>
        </Row>
        </div>
        ) : (
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>
        )}
      </Container>
    )
  
}
export default ViewProfile;
