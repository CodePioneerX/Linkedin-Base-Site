import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Card, Container, Button, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import '../Assets/css/Admin.css';

const AdminUserCard = (props) => {
    
  const navigate = useNavigate();

  // Define state variables
  const [profile, setProfile] = useState("");
  const [reportMessages, setReportMessages] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const updateToken = useSelector((state) => state.updateToken);
  const { loading, auth } = updateToken;

// Function to get user profile information
  const getProfile = async () => {
    // Send GET request to retrieve user profile information
    const {data} = await axios.get(
      `http://localhost:8000/api/profile/${props.userId}`
    );
    // Update state with retrieved profile information
    setProfile(data.profile);
  };

  const getReportMessages = async () => {
    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth.access}`   
      }
    } 

    // Send GET request to retrieve user report messages
    const {data} = await axios.get(
      `http://localhost:8000/api/users/reports/${props.userId}`, config
    );
    // Update state with retrieved report messages
    setReportMessages(data);
  }

  const banHandler = async () => {
    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth.access}`   
      }
    }
    const response = await axios.put(`http://localhost:8000/api/users/ban/${props.userId}`, {}, config)
    window.location.reload()
  }

  const dismissReportHandler = async () => {
    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth.access}`   
      }
    }
    const response = await axios.delete(`http://localhost:8000/api/users/report/dismiss/${props.userId}`, config)
    window.location.reload()
  }

  const viewProfile = () => {
    navigate('/profileScreen', { state: {data: props.userId} })
  }

  // Call getProfile() function when component mounts
  useEffect(() => {
    getProfile();
    getReportMessages();
  }, []);

  return (
    <>
      <Container className="adminCardContainer">
        <div className="card_body">
          <Row>
            <Col xs={8} md={10}>
              <Row className="adminCardRow">
                <img className="img-fluid rounded-pill adminCardProfileImage" src={profile.image}></img>
                <h4>{profile.name}</h4>
              </Row>
              <Row className="adminCardRow">
                <hr style={{width: "100%"}}/>
              </Row>
              {reportMessages && reportMessages.length > 0 && reportMessages.map(report => (
                <Row className="adminCardRow" key={report.id}>
                  <p><strong>{report.sender_name}</strong> ({report.sender_email}): "{report.message}"</p>
                </Row>
              ))
              }
              <Row className="adminCardRow">
                <hr style={{width: "100%"}}/>
              </Row>
            </Col>
            <Col xs={4} md={2} style={{display:'flex', justifyContent:'right'}}>
              <Row>
                <DropdownButton id='dropdownButton' title=''>
                  <Dropdown.Item as="button" onClick={viewProfile}>View Profile</Dropdown.Item>
                  <Dropdown.Item as="button" onClick={dismissReportHandler}>Dismiss Report</Dropdown.Item>
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

export default AdminUserCard;
