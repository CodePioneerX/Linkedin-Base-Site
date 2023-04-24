import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Alert} from "react-bootstrap";
import { FormGroup, Label, Input} from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import '../Assets/css/App.css'
import RecommendationCard from '../components/RecommendationCard';
import { Link, useLocation } from "react-router-dom";
import { sendRecommendation } from "../actions/recommendAction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";

export const ProfileScreen =()=>{

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [recommendation, setRecommendation] = useState("");    //Holds and sets the value
    const [receivedRecommendations, setReceivedRec]= useState("");
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //recommendation data
    // const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    
    //get ids to be used
    const location = useLocation();
    const otherUserId = location.state.data;
    const myUserId = userInfo.id;
    const [profile, setProfile] = useState("");

    //variables for condition check
    const [isConnected, setIsConnected] = useState(false);
    const [connectPending, setConnectPending] = useState(false);
    const [connectSender, setConnectSender] = useState(false);
    const [connectStatus, setConnectStatus] = useState("");
    const [isForumOpen, setIsForumOpen] = useState(false);
    const [message, setMessage] = useState('');

    const [recommended, setRecommended] = useState(false);
    const [recommendForm, setRecommendForm] = useState(false);
    
    const [reportForm, setReportForm] = useState(false);
    const [reportMessage, setReportMessage] = useState("")

    //functions for connection
    const checkPendingConnection = async (e) =>{
        //axios request
        //change state
    };

    const handleOpenForum = () => {
      setIsForumOpen(true);
    };

    const handleCloseForum = () => {
      setIsForumOpen(false);
    };

    const handleSendMessage  = async () =>{

      const { data } = await axios.get(
        `http://insightwearai.sytes.net:8000/api/profile/` + location.state.data
      );
      
      console.log(message);
      console.log(userInfo.email);
      console.log(data.profile.email);

      var to_user_id = data.profile.email; // u put the other user email here
      var from_user_id = userInfo.email; // u put your email here
      var chat_id;

      // Create a new chat and get the chat_id
      try {
        const createChatResponse = await fetch(
          `http://insightwearai.sytes.net:8000/create_chat/NewChat with ${to_user_id}/${from_user_id}/${to_user_id}/`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (createChatResponse.ok) {
          const createChatData = await createChatResponse.json();
          chat_id = createChatData.pk;
        } else {
          console.error(
            'Error creating chat:',
            createChatResponse.status,
            createChatResponse.statusText
          );
          return;
        }
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }



  // Send the message to the server
  try {
    const response = await fetch(
      `http://insightwearai.sytes.net:8000/chat/${chat_id}/send_message/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          chat: chat_id,
          from_user: from_user_id,
          to_user: to_user_id,
          content: message,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('Message sent:', data);
      navigate("/messaging");
      window.location.reload(false);
    } else {
      console.error(
        'Error sending message:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }

      setMessage(""); // clear the message textarea
      setIsForumOpen(false); // close the forum
    };

    //check the connection status between the logged-in user and the searched user
    const checkConnection = async (e) =>{
        
      try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.get(
              `http://insightwearai.sytes.net:8000/api/connections/status/` + myUserId +`/`+ otherUserId +`/`,
                config
            )
            
            // console.log("check connection called.")
            setConnectStatus(data.status)
            // console.log(recommended)
            // console.log(connectStatus)
            if(connectStatus=="Connected"){
              setIsConnected(true)
            }
            if(connectStatus=="Pending"){
              setConnectPending(true)
              setConnectSender(true)
            }
            if(connectStatus=="Confirm"){
              setConnectPending(true)
              setConnectSender(false)
            }
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    };

    //send the connection request to the searched user
    const sendConnection = async (e) =>{
        //axios request
        
        e.preventDefault()
        try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.post(
              `http://insightwearai.sytes.net:8000/api/connections/create/` + myUserId +`/`+ otherUserId +`/`,
                config
            )
            window.location.reload(false)  
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    
    
      };

    //disconnect from the searched user
    const cancelConnection = async (e) =>{
        //axios request
        console.log("send connection")
        e.preventDefault()
        try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.delete(
              `http://insightwearai.sytes.net:8000/api/connections/delete/` + myUserId +`/`+ otherUserId +`/`,
                config
            )
            window.location.reload(false)  
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    }

    //display the recommendation form
    const enterRecommendation =() =>{
        setRecommendForm(true)
    };

    //hide the recommendation form
    const exitRecommendation =() =>{
        setRecommendForm(false)
    };

    const enterReport = () => {
      setReportForm(true)
    };

    const exitReport = () => {
      setReportForm(false)
    };

    //check if the current logged in user has recommended the searched user
    const checkRecommendation = async () =>{
      const { data } = await axios.get(
        `http://insightwearai.sytes.net:8000/api/profile/` + myUserId
      );
      // console.log(data)
      // console.log(data.sent_recommendations)
      var i ;
      for(i=0; i < data.sent_recommendations.length; i++){
      if(data.sent_recommendations[i].recipient == otherUserId){
        // console.log(i);
        setRecommended(true);
    setRecommendForm(false)
        break;
      }}
    };

    //send the recommendation request to the backend
    const sendRecommendationHandler = async (e) =>{
        e.preventDefault()
        if (description === ""){
            alert("Description cannot be empty!")
            return;
        }
        dispatch(sendRecommendation(myUserId, otherUserId,description));
          window.location.reload(false)       
    }

    //cancel the recommendation to the searched user if has recommended
    const cancelRecommendation = async (e) =>{
        e.preventDefault()
        try 
        {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
    
            const { data } = await axios.delete(
              `http://insightwearai.sytes.net:8000/api/delete_recommendation/` + myUserId +`/`+ otherUserId,
                config
            )
            window.location.reload(false)  
        }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
    }

    //get the data of the searched user's profile
    const getProfile = async () => {
        const { data } = await axios.get(
          `http://insightwearai.sytes.net:8000/api/profile/` + otherUserId
        );
        setProfile(data.profile);
        setRecommendation(data.sent_recommendations);
        setReceivedRec(data.received_recommendations)
      };

      const reportUser = async (e) => {
        e.preventDefault()
        try {
          // Set the headers for the HTTP request
          const config = {
            headers: {
              'Content-type': 'application/json',
            }
          }
        
          // Send the HTTP request to report the user
          const { data } = await axios.post(
            `http://insightwearai.sytes.net:8000/api/users/report/`,
              { 'sender': userInfo.id,
                'recipient': otherUserId,
                'message': reportMessage },
              config
          )
          window.location.reload(false) 
        } catch(error) {
          console.log(error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message)
        }
      }

      //page set up
      useEffect(() => {
        getProfile();
        checkConnection();
        checkRecommendation()
        
      }, [
        isConnected,connectPending,connectSender,connectStatus,recommended,recommendForm,reportForm, isForumOpen
      ]);

    return (    
    <div id="profilePage">
    <Container id="profileContainer" className="justify-content-md-center padd">
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
                        <button className="profile-button" onClick={cancelConnection}>Disconnect</button>
                            {recommended? 
                            <button className="profile-button" onClick={cancelRecommendation}>Cancel recommendation</button>
                            :
                            <button className="profile-button" onClick ={enterRecommendation}>Recommend</button>}
                        <button className="profile-button" onClick={handleOpenForum}>Message</button>
                        <button className="profile-button" onClick={enterReport}>Report User</button>
                        </div>
                        :  
                            (connectPending? 
                              (connectSender?
                                <div>
                                <button className="profile-button" style={{ backgroundColor: "gray" }} disabled = {true} >Connect request sent</button>
                                </div>
                                :
                                <div>
                                  <Link to='/network'>
                                <button className="profile-button">Handle connect request</button>
                                  </Link>
                                </div>)
                            :
                            <div>
                            <button className="profile-button" onClick={sendConnection}>Connect</button>
                            <button className="profile-button" onClick={enterReport}>Report User</button>

                            

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
                                <Button type = 'submit' className='editSaveButton' onClick={sendRecommendationHandler}> Save </Button>
                            </Col>
                            <Col xs={12} md={6}>
                                <Button className='editCancelButton' onClick={exitRecommendation}>Cancel</Button>
                            </Col>
                        </Row>
                        </Form>
                    :<></>
                    }
                    {reportForm && 
                    <Form>
                      <FormGroup >
                        <Label className='labelE' for="report-message">Report Description</Label>
                        <textarea style={{width : "100%" }} required
                        name="report-message" id="report-message" placeholder="Please describe the reason that you are reporting this user." 
                          onChange={(e)=> setReportMessage(e.target.value)}/>
                        </FormGroup>
                        <Row className='editButtonContainer' >
                            <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                                <Button type='submit' className='editSaveButton' onClick={reportUser}>Send Report</Button>
                            </Col>
                            <Col xs={12} md={6} style={{display: 'flex', justifyContent: 'center'}}>
                                <Button className='editCancelButton' onClick={exitReport}>Cancel</Button>
                            </Col>
                        </Row>
                    </Form>
                    }
                    {isConnected && isForumOpen && (
                      <div className="forum-pop-up" style={{padding: '10px 0 0 10px'}}>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message here" style={{ borderRadius: '10px', width: '100%', marginTop: '10px', padding: '10px' }}></textarea>
                        <button onClick={handleCloseForum} style={{ border: 'none', outline: 'none', background: 'white' }}><FontAwesomeIcon icon={faCircleXmark} size="2x" /></button>
                        <button onClick={handleSendMessage} style={{ border: 'none', outline: 'none', background: 'white' }}><FontAwesomeIcon icon={faCircleChevronRight} size="2x"/></button>
                      </div>
                    )}

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
  </Container>
  </div>)
}
