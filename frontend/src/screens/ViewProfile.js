import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../components/Posts-old";
import { useNavigate, Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { EditProfileForm } from '../components/EditProfileForm';
import { EditPostForm } from '../components/EditPostForm';
import '../Assets/css/App.css'
import { get_profile } from '../actions/userActions'
import { get_notifications } from "../actions/notificationActions";
import ConnectionCard from '../components/ConnectionCard';
import RecommendationCard from "../components/RecommendationCard";


function ViewProfile() {
  const [profile, setProfile] = useState("");
  const [recommendation, setRecommendation] = useState("");    //Holds and sets the value
  const [receivedRecommendations, setReceivedRec]= useState(""); 
  const [editor, setEditor] = useState(false)
  const [postEditor, setPostEditor] = useState(false)
  
  const [post, setPost] = useState('')

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const notifications = useSelector((state) => state.notifications);

  const { userInfo } = userLogin;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else {
    getProfile();
  }
  }, [userInfo, navigate]);

  const getProfile = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/api/profile/` + userInfo.id
    );
    setProfile(data.profile);
    setRecommendation(data.sent_recommendations);
    // console.log(data)
    setReceivedRec(data.received_recommendations);

    // console.log(data)
  };

  useEffect(() => {
    getProfile();
    // dispatch(get_profile(userInfo.id))
    dispatch(get_notifications(userInfo.id))
  }, []);

  const editorMode = ()=>{
    setEditor(true)
  }
 
  const quitEditor = ()=>{
    setEditor(false)
  }

  const postEditorMode = () => {
    setPostEditor(true)
  }

  const quitPostEditor = () => {
    setPostEditor(false)
  }

  const createPost = () => {
    navigate('/create/post/')
  }

  return (
    
    <Container className="justify-content-md-center padd">
     
      {userInfo ? (
        <div className="profile-page">
          <div style={{ display: "flex" }}>
            <div style={{ flex: 5}}>
            {editor ? <EditProfileForm profile={profile} quitEditor={quitEditor}/> : 
            postEditor ? <EditPostForm post={post} quitPostEditor={quitPostEditor}/> : 
              <Container>
                <Row>
                  {/* Bio + Resume Column  */}
                  <Col sm={12} md={12} lg={8}>
                    {/* <Row> */}
                    <div className="profile-main-card">
                      <Row style={{backgroundImage: `url(${require("../images/a.jpg")})`, paddingBottom: "15px", backgroundSize: "cover", backgroundPosition: "center center", display: "flex", flexDirection: "column", alignItems: "center"}}>     
                        <img src={profile.image} alt="Profile" className="profile-image padd_small" style={{ borderRadius: "50%", width: "auto", height: "250px"}}/>
                      </Row>

                      <Row style={{background:"white",display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div style={{textAlign: "center", padding: "1rem"}}>
                          <h1 className="profile-name">{profile.name}</h1>
                          <h4 className="profile-title">{profile.title}</h4>
                          <h6 className="profile-city" style={{paddingBottom:"10px"}}>{profile.city}</h6>
                          <button className="profile-button">Connections</button>
                          <button className="profile-button" onClick={editorMode}>Edit Profile</button>
                          <button className="profile-button">Contact Info</button>
                        </div>
                      </Row>
                    </div>
                      <Row>
                        <Col>
                          <div className="profile-header">
                            <div className="profile-card">
                              <h2 className="padd_small"><b>About Me</b></h2>
                              <p className="about-me">{profile.about}</p>
                            </div>
                            <div className="profile-card">
                              <h2 className="padd_small"><b>Experience</b></h2>
                              <ul className="experience-list">{profile.experience}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Education</b></h2>
                              <ul className="education-list">{profile.education}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Recommendations</b></h2>
                              
                     
                              <Tabs style={{paddingTop:"1rem"}}
                                defaultActiveKey="recieved"
                                id="receivedRecommendations"
                                className="mb-3">
                  
                              <Tab eventKey="received" title="Received">
                                {receivedRecommendations && Array.isArray(receivedRecommendations) && receivedRecommendations.map((rec, index) => (
                                  <RecommendationCard key={rec.id} senderId={rec.sender} recipientId={rec.recipient} description={rec.description} type={'received'}/>
                                ))}
                              </Tab>
                              <Tab eventKey="recommended" title="Recommended">
                                {recommendation && Array.isArray(recommendation) && recommendation.map((rec, index) => (
                                  <RecommendationCard key={rec.id} senderId={rec.sender} recipientId={rec.recipient} description={rec.description} type={'sent'}/> 
                                ))}
                              </Tab>
                            </Tabs>             
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Work</b></h2>
                              <ul className="work-list">{profile.work}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Volunteering</b></h2>
                              <ul className="volunteering-list">{profile.volunteering}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Courses</b></h2>
                              <ul className="courses-list">{profile.courses}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Projects</b></h2>
                              <ul className="projects-list">{profile.projects}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Awards</b></h2>
                              <ul className="awards-list">{profile.awards}</ul>
                            </div>

                            <div className="profile-card">
                              <h2 className="padd_small"><b>Languages</b></h2>
                              <ul className="languages-list">{profile.languages}</ul>
                            </div>

                          </div>
                        </Col>
                      </Row>
                  </Col>
                  
                  {/* Activity Column */}
                  <Col sm={12} md={12} lg={4}>
                    <Row>
                        <div className="profile-header" style={{ backgroundColor: "white", borderRadius: "7px", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem"}}>
                          <Row>
                            <Col md={8}><h2>Activities</h2></Col>
                            <Col md={4}>
                              <Link className='profile-button' to='/create/post/' state={{from: "/profile/"}}>
                                <button style={{ backgroundColor: "#3D13C6", color: "white", borderRadius: "25px", padding: "5px 10px", border: "none" }}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "white"}}/> </button>
                              </Link>
                            </Col>
                          </Row>
                          <Posts u_id={userLogin.userInfo.id} edit={postEditorMode} quit={quitPostEditor} setpost={setPost}/>
                        </div>
                    </Row>
                  </Col>
                </Row>
              </Container>
      }
        </div>        
      </div>
      <Row>
        <div className="profile-content">
          <Container className="justify-content-md-center pd-5 padd_small"></Container>
        </div>
      </Row>
    </div>
      ) : (
        <Alert className="alertLogin" key="primary" variant="primary">
          <h5>
            You are not signed in! Please <a href="/login">Sign in</a> or{" "}
            <a href="/register">Register</a>!
          </h5>
        </Alert>
      )}
    </Container>
  );
}
export default ViewProfile;
