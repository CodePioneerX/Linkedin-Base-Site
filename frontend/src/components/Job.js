import React, { Component } from 'react'
import {Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios'
import Comment from './Comment';
import Message from './Message';
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

export default class Job extends Component {
// Define the initial state
    state = {
        job: [],
        error: ''
    }

// Fetching data from API when component mounts
    componentDidMount() {
        try {
            axios.get(`http://localhost:8000/api/job/${this.props.job_id}`)
                .then(res => this.setState({ job: res.data[0], required_docs: res.data[1], ready: true })) // Update the state with the job details and required documents
                .catch(() => this.setState({error: true})) // If there's an error fetching the data, set the error state to true
       } catch(error) {
        console.log(error)
       }
    }

// Handling clicking on a job item
    handleClick = job => () => {
        let required_docs = this.state.required_docs

        let job_ = {...this.state.job, required_docs}
        
        this.props.setjob(job_)
        this.props.edit()
    }

    reportJob = job => () => {
        // report the job
        this.props.setjob(job)
        this.props.report()
      }    

// Rendering the job details and comments
  render() {
// Defining a Comment component to display individual comments
      const Comment = ({ author, content, createdAt }) => {
          return (
            <div style={{ marginBottom: 20 }}>
            <p>Author: {author}</p>
            <p>Content: {content}</p>
            <p>Created at: {createdAt}</p>
          </div>
        );
    };

    if (this.state.error) return (
    <>
        
        <Message variant='danger'>There was an error while loading job data. Please try again later.</Message>
    </>
    ) 
    if (this.state.ready) return (
      <>
        <Row style={{marginBottom: "25px", width: "100%"}}>
            <Container style={{paddingBottom:"80px"}}>
            <Col xs={12} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
            <div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
            <Row className='mb-4'>
                <Col xs={8} md={10}>
                <span>
                    <h2>{this.state.job.title} at {this.state.job.company}</h2>
                </span>
                </Col>
                <Col xs={4} md={2} style={{display:'flex', alignItems: 'center', justifyContent: 'end'}}>
                    <DropdownButton variant="secondary" title="">
                      {this.props.author == this.state.job.author ? 
                      <>
                        <Dropdown.Item as="button" onClick={this.handleClick(this.state.job)}>Edit Job</Dropdown.Item>
                      </>
                        : 
                      <>
                        <Dropdown.Item as="button" onClick={this.reportJob(this.state.job)}>Report Job</Dropdown.Item>
                      </>
                      }
                    </DropdownButton>
                </Col>
            </Row>
            <Container className='darker'>
                {this.state.job.image ? <img src={'http://localhost:8000'+this.state.job.image} alt={this.state.job.title} style={{ borderRadius: "50%", width: "auto", height: "55px", marginRight: "10px" }} /> : <></>}
                <Row>
                <Col xs={12}>
                    <h4>Description: </h4>
                    <p style={{whiteSpace: 'pre-wrap'}}>{this.state.job.description}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Location: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p >{this.state.job.location}</p>
                    {this.state.job.remote ? <p>Remote work possible.</p> : <p>Must be willing to work in person.</p>} 
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Salary: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>${this.state.job.salary} {salary_types.map(type => ((type.value == this.state.job.salary_type) && <span key={type.value}>{type.name}</span>))}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Position Type: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{job_types.map(type => ((type.value == this.state.job.job_type) && <span key={type.value}>{type.name}</span>))}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Employment Term: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{employment_terms.map(type => ((type.value == this.state.job.employment_term) && <span key={type.value}>{type.name}</span>))}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Position Type: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{job_types.map(type => ((type.value == this.state.job.job_type) && <span key={type.value}>{type.name}</span>))}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Posted: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{this.state.job.created_at.slice(0, 10)}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Application Deadline: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{this.state.job.deadline.slice(0, 10)}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Status: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{this.state.job.status ? <>Applications Open</> : <>Applications Closed</>}</p>
                </Col>
                </Row>
                <Row className='mb-2'>
                <Col sm={12} md={6} xl={4}>
                    <h4>Application Type: </h4>
                </Col>
                <Col sm={12} md={6} xl={8}>
                    <p>{(this.state.job.listing_type == 'INTERNAL') ? <>Internal</> : <a href={this.state.job.link}>External</a>}</p>
                </Col>
                </Row>
                <Row className='mb-1'>
                <Col sm={12} md={6} xl={4}>
                    {this.state.required_docs.find(doc => doc.required === true) && <h4>Required Documents: </h4>}
                </Col>
                <Col sm={12} md={6} xl={8}>
                    {this.state.required_docs && 
                    <>
                        <ul key={this.state.job.id} style={{paddingLeft:'20px'}}>
                        {this.state.required_docs.map(doc => (
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

            {this.state.job.comments && this.state.job.comments.length > 0 && <h4>Comments</h4>}
            {this.state.job.comments && this.state.job.comments.length > 0 && this.state.job.comments.map(comment => (
                
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
                {this.state.job.listing_type == 'INTERNAL' ? 
                    <Button className='btns' variant="primary">Apply</Button> : 
                    <>
                    <Link to={this.state.job.link}>
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
    </>
    )
  }
}
