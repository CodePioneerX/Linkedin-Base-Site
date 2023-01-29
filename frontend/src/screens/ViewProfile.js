import React, { Component, useState, useEffect} from 'react'
import axios from 'axios';
import {Container, Row, Col} from 'react-bootstrap';
import { useDispatch, useSelector} from 'react-redux';
import Posts from '../components/Posts';

export default class ViewProfile extends Component {
  state = {
    profile: {}
  }

  

  componentDidMount() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const user_id = userInfo.id


    axios.get(`http://localhost:8000/api/profile/${user_id}`)
      .then(res => {
        this.setState({ profile: res.data });
        // console.log("res.data: ", res.data)
      })
      .then(
        // console.log('this.state: ', this.state)
        
      )
  }

  render() {
    return (
      <Container className="justify-content-md-center padd">
        
        <div className="profile-page">
        <Row>
          <Col>
            <div className="profile-header">
              {/* temporary placeholder image */}
              <img src="/images/default.jpg" alt="Profile" class="profile-image padd_small" />
            </div>
          </Col>
          <Col>
          <div className="profile-header padd_small">
            <h1 className="profile-name padd_small">{this.state.profile.name}</h1>
            <h4 className="profile-title padd_small">{this.state.profile.title}</h4>
            <h6 className="profile-city">{this.state.profile.city}</h6>
            <h2 className='padd_small'>About Me</h2>
            <p className='about-me'>{this.state.profile.about}</p>
            <h2 className="padd_small">Experience</h2>
            <ul className="experience-list">
            {this.state.profile.experience}
              {/* {this.state.profile.experience.map(exp => (
                <li key={exp.id}>
                  <h3>{exp.title} at {exp.company}</h3>
                  <p>{exp.description}</p>
                </li>
              ))} */}
            </ul>
            <h2 className="padd_small">Education</h2>
            <ul className="education-list">
              {this.state.profile.education}
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
      </Container>
    )
  }
}