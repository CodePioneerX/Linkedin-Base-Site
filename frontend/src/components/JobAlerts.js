import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col, Container } from 'react-bootstrap';

const JobAlerts = (props) => {
	
	const [jobAlerts, setJobAlerts] = useState("")
	const { userId } = props

	const getJobAlerts = async () => {
		
		const { data } = await axios.get(
			`http://localhost:8000/api/job_alerts/${userId}/`
		);
		setJobAlerts(data)
	}

	const deleteHandler = async (id) => {
		const reponse = await axios.delete(
			`http://localhost:8000/api/job_alerts/delete/${id}/`
		);
    getJobAlerts();
	}

  const formatString = (string) => {
    try {
      return string[0].toUpperCase() + string.slice(1).toLowerCase();
    } catch (error) {
      return ""
    }
  }
  
	useEffect(() => {
		getJobAlerts();
	}, [])

return (
		<>
      {jobAlerts.length !== 0 && <h1>Manage Job Alerts</h1>}
			{jobAlerts && jobAlerts?.map(jobAlert => (
				<Row key={jobAlert.id} className="jobAlertCard mb-4">
					<Container>
						<Col xs={12} >
							<div style={{borderBottom: "1px solid #d3d3d3",marginBottom:"10px"}}></div>
						</Col>
						<Row className='mb-4'>
							<Col xs={8} md={10}>
								<span>
									<h2>Search Term: {jobAlert.search_term}</h2>
								</span>
                <Row>
                  {jobAlert.company &&
                    <Col xs={6} md={3} lg={2}>
                      <h4>Company: </h4>
                      <h6>{jobAlert.company}</h6>
                    </Col>
                  }
                  {jobAlert.location && 
                    <Col xs={6} md={3} lg={2}>
                      <h4>Location: </h4>
                      <h6>{jobAlert.location}</h6>
                    </Col>
                  }
                  {jobAlert.job_type && 
                    <Col xs={6} md={3} lg={2}>
                      <h4>Job Type: </h4>   
                      <h6>{formatString(jobAlert.job_type)}</h6>
                    </Col>
                  }
                  {jobAlert.employment_term && 
                    <Col xs={6} md={3} lg={2}>
                      <h4>Employment Term: </h4>
                      <h6>{formatString(jobAlert.employment_term)}</h6>
                    </Col>
                  }
                  {jobAlert.min_salary == 0 && 
                    <Col xs={6} md={3} lg={2}>
                     <h4>Min Salary: </h4>
                     <h6>{jobAlert.min_salary}</h6>
                    </Col>
                  }
                  {jobAlert.max_salary &&
                    <Col xs={6} md={3} lg={2}>
                      <h4>Max Salary: </h4>
                      <h6>{jobAlert.max_salary}</h6>
                    </Col>
                  }
                  {jobAlert.salary_type && 
                    <Col xs={6} md={3} lg={2}>
                     <h4>Salary Type: </h4>
                     <h6>{formatString(jobAlert.salary_type)}</h6>
                    </Col>
                  }
                  {jobAlert.listing_type && 
                    <Col xs={6} md={3} lg={2}>
                      <h4>Listing Type: </h4>
                      <h6>{formatString(jobAlert.listing_type)}</h6>
                    </Col>
                  }
                  {jobAlert.remote !== null && 
                    <Col xs={6} md={3} lg={2}>
                      <h4>Remote: </h4>
                      <h6>{jobAlert.remote.toString()}</h6>
                    </Col>
                  }
                </Row>
							</Col>
							<Col xs={4} md={2} style={{display:'flex', alignItems: 'center', justifyContent: 'end'}}>
                <Button variant='secondary' onClick={() => deleteHandler(jobAlert.id)}>
                  Delete Job Alert
                </Button>
							</Col>
						</Row>
						<Col>
							<div style={{borderBottom: "1px solid #d3d3d3"}}></div>
						</Col>
					</Container>
    		</Row>
			)
			)}
		</>
  )
}

export default JobAlerts;
