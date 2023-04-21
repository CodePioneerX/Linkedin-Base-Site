import React, { Component } from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane, faPenToSquare } from '@fortawesome/free-regular-svg-icons';


export default class Posts extends Component {
  state = {
    data: [],
    draft_comments: {},
  }



  handleClick = post => () => {
    this.props.setpost(post)
    this.props.edit()
  }

  componentDidMount() {
    axios.get(`http://localhost:8000/api/posts/user/` + this.props.u_id)
          .then(res => this.setState({ post_data: res.data['post_data'], profiles: res.data['profiles']}))
  }
  
  handleLike = post_id => () => {
    const config = {
      headers: {
        'Content-type': 'application/json'
      }
    }
    axios.post(`http://localhost:8000/api/posts/like/${post_id}/`, {'user_id': this.props.u_id}, config)
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
      axios.post(`http://localhost:8000/api/posts/comment/${post_id}/`, {'user_id': this.props.u_id, 'content': this.state.draft_comments[post_id]}, config)
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
    console.log(draft_comments_)
    this.setState({draft_comments: draft_comments_})
  }

  render() {
    const posts = this.state.post_data
    const profiles = this.state.profiles

    return (
      <Container style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        
          <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"100px"}}>  
              {posts && posts.map(post => (
                <Row  key={post.id} style={{marginBottom: "25px"}}>
                  <Container style={{padding: "35px 0 0 35px", paddingBottom: "0" }}>
                  <Col xs={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
                          <div style={{marginBottom:"10px"}}></div>
                        <Row style={{ display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                          {/* <img src={post.image} alt={post.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> */}
                          <Col xs={10}>
                            <h5><strong>{(profiles.find(profile => profile.user === post.author).name)}</strong></h5>
                          </Col>
                          <Col xs={2}style={{display:'flex', alignItems: 'center', justifyContent: 'end'}}>
                            <button onClick={this.handleClick(post)} style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "white"}}/> </button>
                          </Col>
                        </Row>
                        <h4 style={{ textAlign: "center",paddingBottom: "5px", paddingTop:"6px"}}>{post.title}</h4>
                        <p style={{padding: "15px 0", maxWidth: "100%", whiteSpace: "normal"}}>{post.content}</p>
                        <Row style={{ justifyContent: "space-between", borderBottom: "1px solid #D3D3D3", marginBottom:"10px" }}>
                          <p style={{ marginLeft: "10px", fontSize: "14px", color: "#808080" }}>
                            <FontAwesomeIcon icon={faHeart} style={{ color: "red", fontSize: "19px" }}/> {post.num_likes} Likes
                          </p>
                          <p style={{ marginRight: "10px", fontSize: "14px", color: "#808080" }}>
                            Posted: {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </Row>
                        <Row>
                          <p>{post.num_comments} Comments</p>
                        </Row>
                        {post.comments?.map(comment => (
                          <Row key={comment.id} >
                            <Col xs={12}>
                              <p><strong>{(profiles.find(profile => profile.user === comment.author).name)}</strong></p>
                            </Col>
                            <Col md={12}>
                              <p>{comment.content}</p>
                            </Col>
                          </Row>
                        ))}
                        <Row style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }} onClick={this.handleLike(post.id)}><FontAwesomeIcon icon={faHeart} style={{ color: "white"}}/> </button>
                          <Form.Control className='padd pad_down limit_width' type="text" placeholder="Comment..." value={this.state.draft_comments[post.id] || ""} onChange={(e) => this.handleCommentChange(post.id, e.target.value)} style={{ width: "60%", marginLeft: "10px" }} />
                          <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none", marginLeft:"10px"}} onClick={this.handleComment(post.id)}>
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
