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
    MDBPagination, 
    MDBPaginationItem, 
    MDBPaginationLink
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
                  <img className='img_box' src={('http://localhost:8000/images/'+job.image.split('images/')[1])} />
                  <p>By: {job.author}</p>
                  <p>Likes: {job.likes}</p>
                  <p>Created at: {job.created_at}</p>
                  <p>Salary: {job.salary}$/hour</p>
                   <p>Location: {job.location}</p>
                    <p>Category: {job.category}</p>
                  <br/>

            
                {job.comments.length > 0 && <h4>Comments</h4>}
                {job.comments.length > 0 && job.comments.map(comment => (
                    
                    <Row>
                            <MDBContainer >
                            <MDBRow> 
                            <MDBCard className="mb-4 restrict-height">
                                    <MDBCardBody className='common-width '>
                                      <Row> 
                                    

                                    <div className="d-flex justify-content-between common-width">
                                        <Col>
                                            <div className="d-flex flex-row align-items-center">
                                            <MDBCardImage
                                                className="rounded-circle"
                                                src='http://localhost:8000/images/default.png'
                                                alt="avatar"
                                                // width="25"
                                                // height="25"
                                            />
                                            <p className="tiny">{comment.author}</p>
                                            </div>
                                        </Col>
                                        <Col><p className="small">{comment.content}</p></Col>
                                        <Col>
                                          <div className="d-flex flex-row align-items-center">
                                          <p className="tiny text-muted ">Likes ( </p>
                                          <MDBIcon
                                              far
                                              icon="thumbs-up fa-xs text-black"
                                              
                                          />
                                          <p className="small text-muted "> 3)</p>
                                          </div>
                                        </Col>
                                    </div>
                                    </Row>
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
        <Row>
        <nav aria-label='Page navigation example'>
          <MDBPagination className='mb-0'>
            <MDBPaginationItem>
              <MDBPaginationLink href='#'>Previous</MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink href='#'>1</MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink href='#'>2</MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink href='#'>3</MDBPaginationLink>
            </MDBPaginationItem>
            <MDBPaginationItem>
              <MDBPaginationLink href='#'>Next</MDBPaginationLink>
            </MDBPaginationItem>
          </MDBPagination>
        </nav>
        </Row>
      </Container>
    )
  }
}