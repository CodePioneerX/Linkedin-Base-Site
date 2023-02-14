import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';


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
      <Container style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        
          <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"100px"}}>  
              {/* <Col xs={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none",}}>
                    <Row style={{marginBottom: "1rem", background:"white"}}>
                    <div style={{ borderRadius: "20px", overflow: "hidden" }}>
                      <input type="text" placeholder="Start a post" style={{ 
                        border: "none", 
                        borderRadius: "20px", 
                        padding: "10px 20px", 
                        width: "100%",
                        outline: "none",
                      }} />
                    </div>
                    </Row>
                    <Row>
                        <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "10px 20px", border: "none", marginRight: "10px"}}>Attach File </button>
                        <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "10px 20px", border: "none", marginRight: "10px"}}>Post</button>
                    </Row>
              </Col>   */}

              {this.state.posts.map(post => (
                <Row  key={post.id} style={{marginBottom: "25px"}}>
                  <Container style={{padding: "35px 0 0 35px", paddingBottom: "0" }}>
                  {/* <Col xs={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
                          <div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
                        <Row style={{ display: "flex", alignItems: "center"}}>
                          <img src={post.image} alt={post.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} />
                          <p>{post.author}</p>
                        </Row>
                  </Col> */}
                  <Col xs={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
                          <div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
                        <Row style={{ display: "flex", alignItems: "center"}}>
                          <img src={post.image} alt={post.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} />
                          <p>{post.author}</p>
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
