import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Posts from "../components/Posts-old_copy";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { EditProfileForm } from '../components/EditProfileForm';


function ViewProfile() {
  const [profile, setProfile] = useState("");
  const [editor, setEditor] = useState(false)

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  console.log("userLogin: ", userLogin);
  console.log("userInfo: ", userInfo);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const getProfile = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/api/profile/` + userInfo.id
    );
    setProfile(data);
  };

  useEffect(() => {
    //make request to get profile details
    getProfile();
  }, []);

  const editorMode = ()=>{
    setEditor(true)
  }
 
  const quitEditor = ()=>{
    setEditor(false)
  }

  return (
    <Container className="justify-content-md-center padd">
      {userInfo ? (
        // (editor? <EditProfileForm profile={profile} quitEditor={quitEditor}/>: 
        <div className="profile-page">
          <div style={{ display: "flex" }}>
            <div style={{ flex: 5}}>
            {editor? <EditProfileForm profile={profile} quitEditor={quitEditor}/>: 
          <Col>
          <div style={{borderRadius: "10px", overflow: "hidden", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", marginBottom: "2rem", borderBottom: "1px solid #ccc"}}>
            <Row style={{backgroundImage: `url(${require("../images/a.jpg")})`, paddingBottom: "15px", backgroundSize: "cover", backgroundPosition: "center center", display: "flex", flexDirection: "column", alignItems: "center"}}>     
              <img src={profile.image} alt="Profile" className="profile-image padd_small" style={{ borderRadius: "50%", width: "auto", height: "250px"}}/>
            </Row>

            <Row style={{background:"white",display: "flex", flexDirection: "column", alignItems: "center"}}>
              <div style={{textAlign: "center", padding: "1rem"}}>
                <h1 className="profile-name">{profile.name}</h1>
                <h4 className="profile-title">{profile.title}</h4>
                <h6 className="profile-city" style={{paddingBottom:"10px"}}>{profile.city}</h6>
                <button style={{backgroundColor: "#3D13C6", color: "white", borderRadius: "20px", padding: "10px 20px", border: "none", marginRight: "10px"}}>
                  Connections
                </button>
                <button style={{backgroundColor: "#3D13C6", color: "white", borderRadius: "20px", padding: "10px 20px", border: "none", marginRight: "10px"}}
                onClick={editorMode}>
                Edit Profile
                </button>
                <button style={{backgroundColor: "#3D13C6", color: "white", borderRadius: "20px", padding: "10px 20px", border: "none", marginRight: "10px"}}>
                Contact Info
                </button>
              </div>
            </Row>
          </div>

                <Row>
                  <Col>
                    <div className="profile-header">

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>About Me</b></h2>
                        <p className="about-me">{profile.about}</p>
                      </div>
                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Experience</b></h2>
                        <ul className="experience-list">
                          {profile.experience}
                          {/* {profile.experience.map(exp => (
                    <li key={exp.id}>
                      <h3>{exp.title} at {exp.company}</h3>
                      <p>{exp.description}</p>
                    </li>
                  ))} */}
                        </ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Education</b></h2>
                        <ul className="education-list">{profile.education}</ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Recommendations</b></h2>
                        <Tabs style={{paddingTop:"1rem"}}
                          defaultActiveKey="recieved"
                          id="recievedRecommendations"
                          className="mb-3">
                          <Tab eventKey="recieved" title="Recieved">
                            <p>This where the recieved recommendations will show</p>
                          </Tab>
                          <Tab eventKey="recommended" title="Recommended">
                              <p>This where the recommended will show</p>
                          </Tab>
                       </Tabs>             
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Work</b></h2>
                        <ul className="work-list">{profile.work}</ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Volunteering</b></h2>
                        <ul className="volunteering-list">{profile.volunteering}</ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Courses</b></h2>
                        <ul className="courses-list">{profile.courses}</ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Projects</b></h2>
                        <ul className="projects-list">{profile.projects}</ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Awards</b></h2>
                        <ul className="awards-list">{profile.awards}</ul>
                      </div>

                      <div style={{backgroundColor: "white", borderRadius: "7px", marginBottom: "2rem", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem", marginBottom: "1rem"}}>
                        <h2 className="padd_small"><b>Languages</b></h2>
                        <ul className="languages-list">{profile.languages}</ul>
                      </div>

                    </div>
                  </Col>
                </Row>
              </Col>
      }
              </div>
              
              <div style={{ flex: 2}}>
              <Col>
                <row>
                  <div
                    className="profile-header" style={{ backgroundColor: "white", borderRadius: "7px", borderBottom: "1px solid #ccc", boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", padding: "1.5rem",}}>
                    <Posts />
                  </div>
                </row>
              </Col>
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
