import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";
import '../Assets/css/Admin.css';

const AdminPostCard = (props) => {
  
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
    const response = await axios.put(`http://localhost:8000/api/users/ban/${author_id}`, {}, config)
    window.location.reload()
  }

  const dismissReportHandler = async () => {
    const config = {
      headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${auth.access}`   
      }
    } 
    const response = await axios.delete(`http://localhost:8000/api/posts/report/dismiss/${id}`, config)
    window.location.reload()
  }

  const deletePostHandler = async () => {
    const response = await axios.delete(`http://localhost:8000/api/post/delete/${post_id}`)
    window.location.reload()
  }

  const viewAuthor = () => {
    navigate('/profileScreen', { state: {data: author_id} })
  }

  const viewSender = () => {
    navigate('/profileScreen', { state: {data: sender_id} })
  }

  const { id, sender_id, sender_name, sender_email, post_id, post_content, post_title, message, author_id, author_name } = props.report

  return (
    <>
      <Container className="adminCardContainer">
          <div className="adminCardBody">
            <Row>
              <Col xs={8} md={10}>
                <Row className="adminCardRow">
                  <h4>Post Author: {author_name}</h4>
                </Row>
                <Row className="adminCardRow">
                  <h4>{post_title}</h4>
                </Row>
                <Row className="adminCardRow">
                  <p>{post_content}</p>
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
                    <Dropdown.Item as="button" onClick={dismissReportHandler}>Dismiss Report</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={deletePostHandler}>Delete Post</Dropdown.Item>
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

export default AdminPostCard;
