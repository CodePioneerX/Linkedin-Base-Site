import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import '../Assets/css/Admin.css';

const AdminJobCard = (props) => {

  const navigate = useNavigate();

  // Define state variables
  const [reportMessages, setReportMessages] = useState("");
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const updateToken = useSelector((state) => state.updateToken);
  const { loading, auth } = updateToken;

  const banHandler = async () => {
    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth.access}`   
      }
    }
    const response = await axios.put(`http://insightwearai.sytes.net:8000/api/users/ban/${author_id}`, {}, config)
    window.location.reload()
  }

  const dismissReportHandler = async () => {
    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth.access}`   
      }
    }
    const response = await axios.delete(`http://insightwearai.sytes.net:8000/api/jobs/report/dismiss/${id}`, config)
    window.location.reload()
  }

  const deleteJobHandler = async () => {
    const response = await axios.delete(`http://insightwearai.sytes.net:8000/api/job/delete/${job_id}`)
    window.location.reload()
  }

  const viewAuthor = () => {
    navigate('/profileScreen', { state: {data: author_id} })
  }

  const viewSender = () => {
    navigate('/profileScreen', { state: {data: sender_id} })
  }

  const viewJob = () => {
    navigate('/job', { state: {job_id: job_id} })
  }

  const { id, sender_id, sender_name, sender_email, job_id, job_title, job_company, job_location, message, author_id, author_name } = props.report

  return (
    <>   
      <Container className="adminCardContainer">
        <div className="adminCardBody">
          <Row>
            <Col xs={8} md={10}>
              <Row className="adminCardRow">
                <h4>Job Author: {author_name}</h4>
              </Row>
              <Row className="adminCardRow">
                <h4>{job_title} at {job_company} in {job_location}</h4>
              </Row>
              <Row className="adminCardRow">
                  <p><strong>{sender_name}</strong> ({sender_email}): "{message}"</p>
              </Row>
              <Row className="adminCardRow">
                <hr style={{width: "100%"}}/>
              </Row>
            </Col>
            <Col xs={4} md={2} style={{display:'flex', justifyContent:'right'}}>
              <Row>
                <DropdownButton id="dropdownButton" title=''>
                  <Dropdown.Item as="button" onClick={viewAuthor}>View Author</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={viewSender}>View Sender</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={viewJob}>View Job</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={dismissReportHandler}>Dismiss Report</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={deleteJobHandler}>Delete Job</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={banHandler}>Ban User</Dropdown.Item>
                </DropdownButton>
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    </>
  );
};

export default AdminJobCard;
