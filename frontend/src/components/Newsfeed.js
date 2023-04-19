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
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import '../Assets/css/Newsfeed.css';

export default class Newsfeed extends Component {
    state = {
        data: [],
        draft_comments: {},
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/newsfeed/${this.props.id}`)
            .then(res => this.setState({ post_data: res.data['post_data'], profiles: res.data['profiles']}))
    }

    handleClick = post => () => {
      this.props.setpost(post)
      this.props.edit()
    }

    handleLike = post_id => () => {
      const config = {
        headers: {
          'Content-type': 'application/json'
        }
      }
      axios.post(`http://localhost:8000/api/posts/like/${post_id}/`, {'user_id': this.props.id}, config)
            .then(res => {
              let posts_ = [...this.state.post_data]
              let index_ = posts_.findIndex(post => post.id === post_id)
              posts_[index_] = res.data
              this.setState({post_data: posts_})
            })
    }

    handleComment = post_id => () => {
      // prevent user from submitting blank comment
      if (this.state.draft_comments[post_id] === undefined || this.state.draft_comments[post_id] === "") {
        return
      } else {
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        }
        axios.post(`http://localhost:8000/api/posts/comment/${post_id}/`, {'user_id': this.props.id, 'content': this.state.draft_comments[post_id]}, config)
              .then(res => {
                let posts_ = [...this.state.post_data]
                let index_ = posts_.findIndex(post => post.id === post_id)
                posts_[index_] = res.data
                this.setState({post_data: posts_})
                
                // reset the draft comment for the post that was just commented on
                let draft_comments_ = this.state.draft_comments
                draft_comments_[post_id] = ""
                this.setState({draft_comments: draft_comments_})
              }).catch(error => {
                console.log('error:', error);
              })
      }
    }

    handleCommentChange(post_id, comment) {
      // update the draft comment corresponding to the post id
      let draft_comments_ = this.state.draft_comments
      draft_comments_[post_id] = comment
      this.setState({draft_comments: draft_comments_})
    }

    render() {
      const posts = this.state.post_data
      const profiles = this.state.profiles
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

              {posts && posts?.map(post => (
                <Row key={post.id} style={{marginBottom: "0%", width: "100%"}}>
                  <Container style={{padding: "2%", paddingBottom: "0"}}>
                    <Col xs={12} style={{ borderRadius: "20px", boxShadow: "0 4px 6px 0 rgba(0, 0, 0, 0.2), 0 6px 13px 0 rgba(0, 0, 0, 0.19)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "0.5%", width: "auto"}}>
                      <div style={{marginBottom:"1%"}}></div>
                      <Row style={{ display: "flex", alignItems: "center"}}>
                        <Col xs={2} md={1}>
                          {/* <img src={post.image} alt={post.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> */}
                          {post.image ? 
                            <img src={'http://localhost:8000'+post.image} alt="test alt image text" style={{ borderRadius: "50%", width: "auto", height: "55px", width: "55px", marginRight: "10px" }} /> : 
                            <p style={{ borderRadius: "50%", border: "0.1rem solid black", width: "auto", height: "55px", width: "55px", marginRight: "10px" }}></p>}
                        </Col>
                        <Col xs={7} md={10}>
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
                          <FontAwesomeIcon icon={faHeart} style={{ color: "red", fontSize: "19px" }}/>  {post.num_likes} Likes
                        </div>
                        <p style={{ marginRight: "10px", fontSize: "14px", color: "#808080" }}>
                          Posted: {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString('en-US')}
                        </p>
                      </Row>
                      {post.comments?.map(comment => (
                        <Row key={comment.id} style={{justifyContent: 'space-between'}}>
                            <Col md={2}>
                              <p><strong>{(profiles.find(profile => profile.user === comment.author).name)}</strong></p>
                            </Col>
                            <Col>
                              <p>{comment.content}</p>
                            </Col>
                            <Col md={2}>
                              <p>{new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString('en-US')}</p>
                            </Col>
                        </Row>
                      ))}
                      <Row className='mb-4'>
                        <Form.Control className='padd pad_down' type="text" placeholder="Comment..." value={this.state.draft_comments[post.id] || ""} onChange={(e) => this.handleCommentChange(post.id, e.target.value)}/>
                      </Row>
                      <Row>
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                          {post.liked ? 
                          <Button id='applyLink' variant="secondary" onClick={this.handleLike(post.id)}><FaThumbsDown className='icon'/><span style={{marginLeft: "3%"}}>Unlike</span></Button>: 
                          <Button id='applyLink' variant="secondary" onClick={this.handleLike(post.id)}><FaThumbsUp className='icon'/><span style={{marginLeft: "3%"}}>Like</span></Button> 
                        }
                        </Col>
                        <Col style={{display: 'flex', justifyContent: 'center'}}>
                          <Button className='jobButton' variant="secondary" onClick={this.handleComment(post.id)}><TfiCommentAlt className='icon'/><span style={{marginLeft: "3%"}}>Comment</span></Button>
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
