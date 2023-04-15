import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col,Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import Form from 'react-bootstrap/Form';
import '../Assets/css/App.css'

const JobPosts= (props) => {

const [jobPosts, setJobPosts] = useState([]) 

const getProfile = async () => {
    try{
    const { data } = await axios.get(
      `http://localhost:8000/api/jobs_applications/user/` + props.u_id
    );
    setJobPosts(data)
    }catch (error) {
      console.log(error)
    }

    
  };

  useEffect(() => {
    getProfile(); 
    console.log(props.u_id);    
  }, []);

  console.log(jobPosts)

    return (
        <Container  >
         {jobPosts.map(jobPost => (
            
            
        <Card style={{ marginTop: "20px" }} key={jobPost.job.id}>
          <Card.Body className='card_body'>
            <Row style={{display:'flex', justifyContent:'left'}}>
            <div>
              <Col style={{display:'flex', justifyContent:'left'}}>
                  <Link to='/job' state={{job_id: jobPost.job.id}} >
                  <Card.Title style={{marginLeft:'1rem'}}>{jobPost.job.title}</Card.Title>   
                  </Link>          
              </Col>
              <Card.Text style={{marginLeft:'2rem',marginTop:'.7rem'}}>{jobPost.job.company}</Card.Text> 
              <Card.Text style={{marginLeft:'2rem',marginTop:'.7rem'}}>Posted: {jobPost.job.created_at.slice(0, 10)}</Card.Text> 
            </div>
              <Col style={{display:'flex', justifyContent:'right'}}>
                <Link to='/jobApplicationReview' state={{job_id: jobPost.job.id, applications:jobPost.applications}}>
                    <Button variant="primary">Review Applications </Button>
                </Link> 
              </Col>
            </Row> 
          </Card.Body>
      </Card>
      ))
          } 
    </Container>
  

    );
  };
  
  export default JobPosts;