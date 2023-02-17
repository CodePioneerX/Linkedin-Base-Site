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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

export default class Jobs extends Component {
  state = {
    jobs: []
  }

  componentDidMount() {
    axios.get('http://localhost:8000/api/jobs/')
      .then(res => this.setState({ jobs: res.data }))
  }

  handleClick = job => () => {
    this.props.setjob(job)
    this.props.edit()
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
      <>
      <Container className="justify-content-md-center padd">
        <Row>
            <h1>Latest Jobs</h1>
        </Row>
        <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"100px"}}>
            {this.state.jobs.map(job => (
              <Row key={job.id} style={{marginBottom: "25px", width: "75%"}}>
              <Container style={{padding: "35px 0 0 35px", paddingBottom: "0" }}>
                <Col xs={10} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
                <div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
                <Row>
                  <Col xs={8} md={10}>
                    <h3>{job.title} at {job.company}</h3>
                  </Col>
                  <Col xs={4} md={2}>
                    {this.props.author == job.author ? <button onClick={this.handleClick(job)} style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "white"}}/> </button> : <></>}
                  </Col>
                </Row>
                <Container className='darker'>
                  <p>{job.content}</p>
                  {/* <img className='img_box' src={(".."+job.image)} alt={job.title} /> */}
                  {/* <img className='img_box' src={('http://localhost:8000/images/'+job.image.split('images/')[1])} /> */}
                  {job.image ? <img src={job.image} alt="test alt image text" style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> : <></>}
                  <p>Description: {job.description}</p>
                  <p>Location: {job.location}</p>
                  <p>Salary: {job.salary}$/hour</p>
                  <p>Position type: {job.job_type}</p>
                  {job.remote ? <p>Remote work possible.</p> : <p>Must be willing to work in person.</p>} 
                  <p>Recruiter: {job.author}</p>
                  <p>Likes: {job.likes}</p>
                  <p>Posted at: {job.created_at}</p>
                  {/* <p>Category: {job.category}</p> */}
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
                    </Row>
                ))}
                  
                  <Form.Control className='padd pad_down limit_width' type="text" placeholder="Comment..."  rows={4} />
                  <br/>
                </Container>

                <Row>
                  <Col>
                    <Button className='btns' variant="primary">Apply</Button>
                  </Col>
                  <Col>
                    <Button className='btns' variant="primary">Like</Button>
                  </Col>
                  <Col>
                    <Button className='btns' variant="secondary">Comment</Button>
                  </Col>
                  
                </Row>
                </Col>
                </Container>
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
    </>
    )
  }
}