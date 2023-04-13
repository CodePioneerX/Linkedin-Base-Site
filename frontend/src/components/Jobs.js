import React, { Component } from 'react'
import {Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

import { salary_types, employment_terms, job_types } from '../constants/jobConstants';

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
      <Container className="justify-content-md-center">
        <Row>
            <h1>Latest Jobs</h1>
        </Row>
        <Row style={{display: "flex", flexDirection: "column", alignItems: "center", marginBottom:"100px"}}>
            {this.state.jobs && Array.isArray(this.state.jobs) && this.state.jobs.map(job => (
            <Row key={job.id} style={{marginBottom: "25px", width: "100%"}}>
              <Container style={{paddingBottom:"80px"}}>
                <Col xs={12} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
                <div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
                <Row className='mb-4'>
                  <Col xs={8} md={10}>
                    <span>
                      <Link to='/job' state={{job_id: job.id}}>
                        <h2>{job.title} at {job.company}</h2>
                      </Link>
                    </span>
                  </Col>
                  <Col xs={4} md={2} style={{display:'flex', alignItems: 'center', justifyContent: 'end'}}>
                    {this.props.author == job.author ? <button onClick={this.handleClick(job)} style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "white"}}/> </button> : <></>}
                  </Col>
                </Row>
                <Container className='darker'>
                  {job.image ? <img src={'http://localhost:8000'+job.image} alt={job.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> : <></>}
                  <Row>
                    <Col xs={12}>
                      <h4>Description: </h4>
                      <p style={{whiteSpace: 'pre-wrap'}}>{job.description}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Location: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p >{job.location}</p>
                      {job.remote ? <p>Remote work possible.</p> : <p>Must be willing to work in person.</p>} 
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Salary: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>${job.salary} {salary_types.map(type => ((type.value == job.salary_type) && <span key={type.value}>{type.name}</span>))}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Position Type: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{job_types.map(type => ((type.value == job.job_type) && <span key={type.value}>{type.name}</span>))}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Employment Term: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{employment_terms.map(type => ((type.value == job.employment_term) && <span key={type.value}>{type.name}</span>))}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Position Type: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{job_types.map(type => ((type.value == job.job_type) && <span key={type.value}>{type.name}</span>))}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Posted: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{job.created_at.slice(0, 10)}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Application Deadline: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{job.deadline.slice(0, 10)}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Status: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{job.status ? <>Applications Open</> : <>Applications Closed</>}</p>
                    </Col>
                  </Row>
                  <Row className='mb-2'>
                    <Col sm={12} md={6} xl={4}>
                      <h4>Application Type: </h4>
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      <p>{(job.listing_type == 'INTERNAL') ? <>Internal</> : <a href={job.link}>External</a>}</p>
                    </Col>
                  </Row>
                  <Row className='mb-1'>
                    <Col sm={12} md={6} xl={4}>
                      {job.required_docs.find(doc => doc.required === true) && <h4>Required Documents: </h4>}
                    </Col>
                    <Col sm={12} md={6} xl={8}>
                      {job.required_docs && 
                        <>
                          <ul key={job.id} style={{paddingLeft:'20px'}}>
                          {job.required_docs.map(doc => (
                            <React.Fragment key={doc.type}>
                              {doc.required && 
                                <><li>{doc.type}</li><br/></>}
                            </React.Fragment>
                          ))}
                          </ul>
                        </>
                      }
                    </Col>
                  </Row>
                  {/* <br/> */}
                {job.comments && job.comments.length > 0 && <h4>Comments</h4>}
                {job.comments && job.comments.length > 0 && job.comments.map(comment => (
                    
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
                <Row className='mb-4'>
                    <Form.Control className='padd pad_down' type="text" placeholder="Comment..." />
                </Row>
                </Container>

                <Row>
                  <Col style={{display: 'flex', justifyContent: 'center'}}>
                    {job.listing_type == 'INTERNAL' ? 
                      <>
                      <Link to="/jobApplication" state={{job_id:job.id}}>
                          <Button className='btns' variant="primary">Apply</Button> 
                      </Link>
                      </> : 
                      <>
                        <Link to={job.link}>
                          <Button className='btns' variant="primary">Apply Externally</Button>
                        </Link>
                      </>
                    }
                  </Col>
                  <Col style={{display: 'flex', justifyContent: 'center'}}>
                    <Button className='btns' variant="primary">Like</Button>
                  </Col>
                  <Col style={{display: 'flex', justifyContent: 'center'}}>
                    <Button className='btns' variant="secondary">Comment</Button>
                  </Col>
                </Row>
                </Col>
              </Container>
          </Row>
            ))}

        </Row>
        <Row style={{display:'flex', justifyContent: 'center'}}>
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
