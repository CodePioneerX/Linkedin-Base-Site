import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Posts from '../components/Posts';
import Button from 'react-bootstrap/Button';
import axios from 'axios'

export default class Home extends Component {
  render() {
    return (
      <Container className="justify-content-md-center padd">
        <Posts/>
      </Container>
    )
  }
}
