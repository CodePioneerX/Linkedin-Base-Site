import React, { Component } from 'react'
import axios from 'axios';
import {Container, Row, Col} from 'react-bootstrap';
import Posts from '../components/Posts';

export default class ViewProfile extends Component {
  state = {
    profile: {}
  }

  componentDidMount() {
    // Make an API call to retrieve the profile information
    axios.get(`http://localhost:8000/api/profile/1`)
      .then(res => {
        this.setState({ profile: res.data });
      })
      .then(
        console.log('this.state.profile: ',this.state.profile)
      )
  }

  render() {
    return (
      <Container className="justify-content-md-center padd">
        
        <div className="profile-page">
        <Row>
          <Col>
            <div className="profile-header">
              <img src={this.state.profile.image} alt="Profile" className="profile-image" />
            </div>
          </Col>
          <Col>
          <div className="profile-header padd_small">
            <h1 className="profile-name padd_small">{this.state.profile.name}</h1>
            <p className="profile-title padd_small">{this.state.profile.title}</p>
            <h2>About Me</h2>
            <p>{this.state.profile.about}</p>
            <h2 className="padd_small">Experience</h2>
            <ul className="experience-list padd_small">
            {this.state.profile.experience}
              {/* {this.state.profile.experience.map(exp => (
                <li key={exp.id}>
                  <h3>{exp.title} at {exp.company}</h3>
                  <p>{exp.description}</p>
                </li>
              ))} */}
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