import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { TfiCommentAlt } from 'react-icons/tfi';
import { FaThumbsUp } from 'react-icons/fa';
import '../Assets/css/Newsfeed.css';

export default class Newsfeed extends Component {
    state = {
        data: []
    }

    

    componentDidMount() {
        axios.get(`http://localhost:8000/api/newsfeed/${this.props.id}`)
            .then(res => this.setState({ data: res.data }))
    }

    handleClick = post => () => {
      this.props.setpost(post)
      this.props.edit()
    }

    render() {
      const posts = this.state.data[0]
      const profiles = this.state.data[1]
    
    return (
      <div id='newsfeedCDiv'>
        <Container id='container' className="justify-content-md-center padd">
            <Row className='networkPosts' style={{marginLeft: "20px", marginBottom: "25px", width: "100%"}}>
              <Col xs={12} md={6} className='text-left'>
                <h1 style={{fontSize: "2em"}}>Network Activity</h1>
              </Col>
              <Col xs={12} md={6} className='text-right'>
              <Container>
                <Link className='create_post_button' to='/create/post/' state={{from: "/"}}>
                  <FiPlus className='icon'/><span>Create Post</span>
                </Link>
              </Container>
              </Col>
            </Row>
            <hr style={{ width: "96%" }}/>

            <Row className='newsFeedContainer' style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"3%"}}>  

              {posts && posts.map(post => (
                <Row key={post.id} style={{marginBottom: "0%", width: "100%"}}>
                  <Container style={{padding: "2%", paddingBottom: "0"}}>
                    <Col xs={12} style={{ borderRadius: "20px", boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.2), 0 6px 13px 0 rgba(0, 0, 0, 0.19)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "0.5%", width: "auto"}}>
                      <div style={{marginBottom:"1%"}}></div>
                      <Row style={{ display: "flex", alignItems: "center"}}>
                        <Col xs={2} md={2}>
                          {/* <img src={post.image} alt={post.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> */}
                          {post.image ? 
                            <img src={'http://localhost:8000'+post.image} alt="test alt image text" style={{ borderRadius: "50%", width: "auto", height: "55px", width: "55px", marginRight: "10px" }} /> : 
                            <p style={{ borderRadius: "50%", border: "0.1rem solid black", width: "auto", height: "55px", width: "55px", marginRight: "10px" }}></p>}
                        </Col>
                        <Col xs={7} md={9}>
                          <h5>{(profiles.find(profile => profile.user === post.author).name)}</h5>
                        </Col>
                        <Col xs={2} md={1} style={{display:'flex', alignItems: 'center', justifyContent: 'end'}}>
                          {this.props.author == post.author ? <button onClick={this.handleClick(post)} style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "white"}}/> </button> : <></>}
                        </Col>
                      </Row>
                      <h4 style={{ textAlign: "left",paddingBottom: "5px", paddingTop:"6px"}}>{post.title}</h4>
                      <p style={{padding: "15px 0"}}>{post.content}</p>
                      <Row style={{ justifyContent: "space-between", borderBottom: "1px solid #D3D3D3", marginBottom:"1%" }}>
                        <div style={{ marginLeft: "10px", fontSize: "14px", color: "#808080" }}>
                          <FontAwesomeIcon icon={faHeart} style={{ color: "red", fontSize: "19px" }}/> {post.likes} Likes
                        </div>
                        <p style={{ marginRight: "10px", fontSize: "14px", color: "#808080" }}>
                          Posted: {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </Row>
                      <Row className='mb-4'>
                        <Form.Control className='padd pad_down' type="text" placeholder="Comment..." />
                      </Row>
                      <Row>
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                          <Button id='applyLink' variant="secondary"><FaThumbsUp className='icon'/><span style={{marginLeft: "3%"}}>Like</span></Button>
                        </Col>
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                          <Button className='jobButton' variant="secondary"><TfiCommentAlt className='icon'/><span style={{marginLeft: "3%"}}>Comment</span></Button>
                        </Col>
                      </Row>
                    </Col>
                  </Container>
                </Row>
              ))}
          </Row>
        </Container>
      </div>
      
    )
    }
}
