import React, { Component } from 'react'
import {Container, Row, Col, Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Comment from './Comment';
import {
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
  } from "mdb-react-ui-kit";
export default class Jobs extends Component {
  state = {
    jobs: []
  }

  componentDidMount() {
    axios.get('http://localhost:8000/api/jobs/')
      .then(res => this.setState({ jobs: res.data }))
  }

  render() {
    const Comment = ({ author, content, createdAt }) => {
        return (
          <div style={{ marginBottom: 20 }}>
            <p>Author: {author}</p>
            <p>Content: {content}</p>
            <p>Created at: {createdAt}</p>
          </div>
        );
      };

    return (
      <Container className="justify-content-md-center padd">
        <Row>

            <h1>Latest Jobs</h1>

        </Row>
        <Row>

        
            {this.state.jobs.map(job => (
              <Row className='padd' key={job.id}>
                <h3>{job.title} @ {job.company}</h3>

                <Container className='darker'>
                  <p>{job.content}</p>
                  {/* <img className='img_box' src={(".."+job.image)} alt={job.title} /> */}
                  <img className='img_box' src={('http://localhost:8000/static/'+job.image.split('images/')[1])} />
                  <p>By: {job.author}</p>
                  <p>Likes: {job.likes}</p>
                  <p>Created at: {job.created_at}</p>
                  <p>Salary: {job.salary}$/hour</p>
                   <p>Location: {job.location}</p>
                    <p>Category: {job.category}</p>
                  <br/>

            
                {job.comments.map(comment => (
                    
                    <Row>
                            <MDBContainer >
                            <MDBRow> 
                            <MDBCard className="mb-4">
                                    <MDBCardBody className='common-width'>
                                    <p>{comment.content}</p>

                                    <div className="d-flex justify-content-between common-width">
                                        <div className="d-flex flex-row align-items-center">
                                        <MDBCardImage
                                            src='http://localhost:8000/static/default.png'
                                            alt="avatar"
                                            // width="25"
                                            // height="25"
                                        />
                                        <p className="small mb-0 ms-2">{comment.author}</p>
                                        </div>
                                        <div className="d-flex flex-row align-items-center">
                                        <p className="small text-muted mb-0">Likes</p>
                                        <MDBIcon
                                            far
                                            icon="thumbs-up mx-2 fa-xs text-black"
                                            style={{ marginTop: "-0.16rem" }}
                                        />
                                        <p className="small text-muted mb-0">3</p>
                                        </div>
                                    </div>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBRow>
                        </MDBContainer>
                        {/* <Comment
                        className='align'
                        key={1}
                        author={comment.author}
                        content={comment.content}
                        createdAt={comment.created_at}
                        />    */}
                    </Row>
                ))}
                  
                  <Form.Control className='padd pad_down limit_width' type="text" placeholder="Comment..."  rows={4} />
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
