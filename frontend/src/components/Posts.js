import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios'

export default class Posts extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    axios.get('http://localhost:8000/api/posts/')
      .then(res => this.setState({ posts: res.data }))
  }

  render() {
    return (
      <Container className="justify-content-md-center padd">
        <Row>
            <h1>Live Feed</h1>
        </Row>
        <Row>

        
            {this.state.posts.map(post => (
              <Row className='padd' key={post.id}>
                <h3>{post.title}</h3>

                <Container className='darker'>
                  <p>{post.content}</p>
                  <img className='img_box' src={post.image} alt={post.title} />
                  <p>By: {post.author}</p>
                  <p>Likes: {post.likes}</p>
                  <p>Created at: {post.created_at}</p>
                </Container>

                <Row>
                  <Col>
                    <Button className='btns' variant="primary">Like</Button>
                  </Col>
                  <Col>
                    <Button className='btns' variant="secondary">Comment</Button>
                  </Col>
                  
                </Row>
              </Row>
            ))}

        </Row>
      </Container>
    )
  }
}