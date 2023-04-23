import React, { Component } from 'react'
import {Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios'
import Message from './Message';
import '../Assets/css/Newsfeed.css';

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
      <div className='pageBackground'>
        <Row id='container'>
          <Container style={{paddingBottom:"80px"}}>
            <Col xs={12} style={{ borderRadius: "20px", boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", padding: "25px", backgroundColor: "white", border: "none", marginBottom: "-40px" }}>
              <Row className='mb-4'>
                <Col xs={8} md={10}>
                  <span>
                    <h2 >{this.state.job.title} at {this.state.job.company}</h2>
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
                    <p className='job-card-text description'>{this.state.job.description}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Location: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{this.state.job.location}</p>
                    {this.state.job.remote ? <p className='job-card-text'>Remote work possible.</p> : <p className='job-card-text'>Must be willing to work in person.</p>} 
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Salary: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>${this.state.job.salary} {salary_types.map(type => ((type.value == this.state.job.salary_type) && <span key={type.value}>{type.name}</span>))}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Position Type: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{job_types.map(type => ((type.value == this.state.job.job_type) && <span key={type.value}>{type.name}</span>))}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Employment Term: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{employment_terms.map(type => ((type.value == this.state.job.employment_term) && <span key={type.value}>{type.name}</span>))}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Position Type: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{job_types.map(type => ((type.value == this.state.job.job_type) && <span key={type.value}>{type.name}</span>))}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Posted: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{this.state.job.created_at.slice(0, 10)}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Application Deadline: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{this.state.job.deadline.slice(0, 10)}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Status: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{this.state.job.status ? <>Applications Open</> : <>Applications Closed</>}</p>
                  </Col>
                </Row>
                <Row className='mb-2'>
                  <Col sm={12} md={6} xl={4}>
                    <h4>Application Type: </h4>
                  </Col>
                  <Col sm={12} md={6} xl={8}>
                    <p className='job-card-text'>{(this.state.job.listing_type == 'INTERNAL') ? <>Internal</> : <a href={this.state.job.link}>External</a>}</p>
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
              </Container>
              <Row>
                <Col style={{display: 'flex', justifyContent: 'center'}}>
                {this.state.job.listing_type == 'INTERNAL' ? 
                <>
                <Link to="/jobApplication" id='applyButtonContainer' state={{job_id:this.state.job.id}}>
                    <Button className='jobButton' id='applyLink'>Apply</Button> 
                </Link>
                </> : 
                    <>
                      <Link to={this.state.job.link} id='applyButtonContainer'>
                        <Button className='jobButton' id='applyLink'>Apply Externally</Button>
                      </Link>
                    </>
                  }
                </Col>
              </Row>
            </Col>
          </Container>
        </Row>
      </div>
    )
  }
}
