import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert} from "react-bootstrap";
import { FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import '../Assets/css/App.css'

import { useLocation } from "react-router-dom";

export const ProfileScreen =()=>{

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    
    const dispatch = useDispatch();

    //recommendation data
    // const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    //get ids to be used
    const location = useLocation();
    const otherUserId = location.state.data;
    const myUserId = userInfo.id;
    const [profile, setProfile] = useState("");

    //variables for condition check
    const [isConnected, setIsConnected] = useState(true);
    const [connectPending, setConnectPending] = useState(false);
    const [connectSender, setConnectSender] = useState(false);
    const [recommended, setRecommended] = useState(false);
    const [recommendForm, setRecommendForm] = useState(false);

    //functions for connection
    const checkConnection =() =>{
        //axios request
        //change state
    };

    const checkPendingConnection =() =>{
        //axios request
        //change state
    };

    const checkConnectSender =() =>{
        //axios request
        //change state
    };

    const sendConnection =() =>{
        //axios request
        //change state
    };

    const cancelConnection =() =>{
        //axios request
        //change state
    }

    //functions for recommendation
    const enterRecommendation =() =>{
        setRecommendForm(true)
    };

    const exitRecommendation =() =>{
        setRecommendForm(false)
    };

    const checkRecommendation = async () =>{
        try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.post(
                'http://localhost:8000/api/recommend/check',
                { 'recommender': myUserId, 'recommendee': otherUserId },
                config
            )
        setRecommended(true);
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    };

    const sendRecommendation = async (e) =>{
        e.preventDefault()
        console.log(myUserId)
        console.log(otherUserId)
        // console.log(title)
        console.log(description)
        if (description === ""){
            alert("Please fill all the blanks!")
            return;
        }
        try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.post(
                `http://localhost:8000/api/create_recommendation/` + otherUserId,
                { 
                // 'recommender': myUserId, 
                // 'recommendee': otherUserId,
                // 'title' : title,
                'description': description},
                config
            )
        setRecommended(true);
        setRecommendForm(false)
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    }

    const cancelRecommendation = async (e) =>{
        e.preventDefault()
        try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.post(
                'http://localhost:8000/api/recommend/cancel',
                { 'recommender': myUserId, 'recommendee': otherUserId },
                config
            )
        setRecommended(false);
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    }

    const getProfile = async () => {
        const { data } = await axios.get(
          `http://localhost:8000/api/profile/` + otherUserId
        );
        setProfile(data.profile);
      };

      useEffect(() => {
        getProfile();
        // checkRecommendation();
      }, []);

    return (    
    <Container className="justify-content-md-center padd">
      <div className="profile-page">
        <div style={{ display: "flex" }}>
          <div style={{ flex: 5}}>
            <Container>
              <Row>
                {/* Bio + Resume Column  */}
                <Col >
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
                        
                        {isConnected? 
                        <div>
                        <button className="profile-button">Disconnect</button>
                            {recommended? 
                            <button className="profile-button" onClick={cancelRecommendation}>Cancel recommendation</button>
                            :
                            <button className="profile-button" onClick ={enterRecommendation}>Recommend</button>}
                        <button className="profile-button">Message</button>
                        </div>
                        :  
                            (connectPending? 
                              (connectSender?
                                <div>
                                <button className="profile-button" style={{ backgroundColor: "gray" }} disabled = {true} >Connect request sent</button>
                                </div>
                                :
                                <div>
                                <button className="profile-button">Handle connect request</button>
                                </div>)
                            :
                            <div>
                            <button className="profile-button">Connect</button>
                            <button className="profile-button">Message</button>
                            </div>)
                        }

                      </div>
                    </Row>
                  </div>
                {/* Recommendation form     */}
                    {recommendForm?
                        <Form>
                        {/* <FormGroup >
                        <Label className='labelE' for="title" >Title</Label>
                        <Input  name="title" id="title" placeholder="write recommendation title here" 
                         onChange={(e)=> setTitle(e.target.value)}/>
                        </FormGroup> */}
                        <FormGroup >
                        <Label className='labelE' for="description" >Description</Label>
                        <textarea style={{width : "100%" }}
                        name="description" id="description" placeholder="write recommendation description here" 
                         onChange={(e)=> setDescription(e.target.value)}/>
                        </FormGroup>
                        <Row className='editButtonContainer'>
                            <Col xs={12} md={6}>
                                <Button type = 'submit' className='editSaveButton' onClick={sendRecommendation}> Save </Button>
                            </Col>
                            <Col xs={12} md={6}>
                                <Button className='editCancelButton' onClick={exitRecommendation}>Cancel</Button>
                            </Col>
                        </Row>
                        </Form>
                    :<></>
                    }

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

                          <div className="profile-card">
                            <h2 className="padd_small"><b>Work</b></h2>
                            <ul className="work-list">{profile.work}</ul>
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
             
              </Row>
            </Container>
    
      </div>        
    </div>
    <Row>
      <div className="profile-content">
        <Container className="justify-content-md-center pd-5 padd_small"></Container>
      </div>
    </Row>
  </div>
  </Container>)
}