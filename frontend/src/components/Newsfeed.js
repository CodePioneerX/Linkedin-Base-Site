import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

export default class Newsfeed extends Component {
    state = {
        posts: []
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/posts/`)
            .then(res => this.setState({ posts: res.data }))
    }

    handleClick = post => () => {
      this.props.setpost(post)
      this.props.edit()
    }

    render() {
        return (
        <Container className="justify-content-md-center padd">
            <Row>
                <h1>Latest Posts</h1>
            </Row>
            <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"100px"}}>  
              {this.state.posts.map(post => (
                <Row  key={post.id} style={{marginBottom: "25px", width: "75%"}}>
                  <Container style={{padding: "35px 0 0 35px", paddingBottom: "0"}}>
                    <Col xs={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px", width: "auto"}}>
                      <div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
                      <Row style={{ display: "flex", alignItems: "center"}}>
                        <Col xs={2} md={2}>
                          {/* <img src={post.image} alt={post.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> */}
                          {post.image ? <img src={'http://localhost:8000'+post.image} alt="test alt image text" style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> : <p></p>}
                        </Col>
                        <Col xs={7} md={8}>
                          <p>{post.author}</p>
                        </Col>
                        <Col xs={2} md={2}>
                          {this.props.author == post.author ? <button onClick={this.handleClick(post)} style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "white"}}/> </button> : <></>}
                        </Col>
                      </Row>
                      <h4 style={{ textAlign: "center",paddingBottom: "5px", paddingTop:"6px"}}>{post.title}</h4>
                      <p style={{padding: "15px 0"}}>{post.content}</p>
                      <Row style={{ justifyContent: "space-between", borderBottom: "1px solid #D3D3D3", marginBottom:"10px" }}>
                        <p style={{ marginLeft: "10px", fontSize: "14px", color: "#808080" }}>
                          <FontAwesomeIcon icon={faHeart} style={{ color: "red", fontSize: "19px" }}/> {post.likes} Likes
                        </p>
                        <p style={{ marginRight: "10px", fontSize: "14px", color: "#808080" }}>
                          Posted: {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </Row>
                      <Row style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faHeart} style={{ color: "white"}}/> </button>
                        <Form.Control className='padd pad_down limit_width' type="text" placeholder="Comment..." style={{ width: "60%", marginLeft: "10px" }} />
                        <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none", marginLeft:"10px"}}>
                          <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                      </Row>
                    </Col>
                  </Container>
                </Row>
              ))}
          </Row>
      </Container>
        )
    }

}
