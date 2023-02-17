import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'

export default class Newsfeed extends Component {
    state = {
        posts: []
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/posts/`)
            .then(res => this.setState({ posts: res.data }))
    }

    render() {
        return (
        <Container className="justify-content-md-center padd">
            <Row>
                {this.state.posts.map(post => (
                    <Row className='padd' key={post.id}>
                        <h3>{post.title}</h3>
                        <Container className='darker'>
                            <p>{post.content}</p>
                            {post.image ? <img className='img_box' src={post.image} alt={post.title} /> : <></>}
                            <p>By: {post.author}</p>
                            <p>Likes: {post.likes}</p>
                            <p>Created at: {post.created_at}</p>
                            <Form.Control className='padd pad_down limit_width' type="text" placeholder="Comment..."  rows={3} />
                            <br/>
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
