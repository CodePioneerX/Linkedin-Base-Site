import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdAddLink, MdLinkOff } from "react-icons/md";
import { TiCancel } from "react-icons/ti";
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import '../Assets/css/Network.css';

const ConnectionCard = (props) => {

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
// const shortAbout = about.split(".")[0] + '...';
    
// Define state variables
const [profile, setProfile] = useState("");

// Function to get user profile information
const getProfile = async () => {
    var userId;

    // Set userId based on connection type
    switch(props.type) {
      case 'received':
        userId = props.senderId;
        break;
      case 'sent':
        userId = props.recipientId;
        break;
      case 'possible':
        userId = props.recipientId;
        break;
      default:
        userId = props.recipientId;
        break;
    }

    // Send GET request to retrieve user profile information
    const {data} = await axios.get(
      `http://localhost:8000/api/profile/${userId}`
    );
    // Update state with retrieved profile information
    setProfile(data.profile);
    
  };

  // Function to handle accepting a connection request
  const acceptHandler = async () => {
    // accept connection request
    const response = await axios.put(
      `http://localhost:8000/api/connections/accept/${props.senderId}/${props.recipientId}/`
    )
    // Reload the page to show updated connection status
    window.location.reload()
  }

  // Function to handle rejecting a connection request
  const rejectHandler = async () => {
   // Send DELETE request to delete connection request
    const response = await axios.delete(
      `http://localhost:8000/api/connections/reject/${props.senderId}/${props.recipientId}/`
    )
    // Reload the page to show deleted connection request
    window.location.reload()
  }

  // Function to handle cancelling a sent connection request
  const cancelHandler = async () => {
    // cancel sent connection request
    const response = await axios.delete(
      `http://localhost:8000/api/connections/cancel/${props.senderId}/${props.recipientId}/`  
    )
    window.location.reload()
  }

  
  // Function to handle sending a connection request
  const sendConnectionRequestHandler = async () => {
  // Send POST request to create new connection request
    const response = await axios.post(
      `http://localhost:8000/api/connections/create/${props.senderId}/${props.recipientId}/`  
    )
    // Reload the page to show newly created connection request
    window.location.reload()
  }

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
          `http://localhost:8000/api/connections/delete/` + userInfo.id +`/`+ props.senderId +`/`,
            config
        )
        window.location.reload(false)  
    }catch(error){
        console.log(error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message)
    }
}

  // Call getProfile() function when component mounts
  useEffect(() => {
     getProfile(); 
  }, []);

  return (
      
    //Card displaying the profile name, option to view profile, buttons to accept, reject, send conection request
    <>
      <Card >
        <Row>
          <Card.Body className='card_body'style={{ height:'90px'}} >
            <div style={{display:'flex', justifyContent:'left'}}>
              <Col style={{display:'flex', justifyContent:'left'}}>
                  <Card.Img className='img-fluid rounded-pill' 
                  style={{width:'50px'}}
                  src={profile.image} />  
                  <Card.Title style={{marginLeft:'1rem',marginTop:'.5rem'}}><Link id='cardTitle' to="/profileScreen" state={{data:props.senderId}}>{profile.name}</Link></Card.Title>             
              </Col>
              <Col style={{display:'flex', justifyContent:'right'}}>
              {props.status == 'accepted' ? 
                <MdLinkOff className="connectionIcon" id='disconnectIcon' style={{marginLeft:'1rem',marginTop:'.5rem'}} onClick={cancelConnection}/>: 
                <>
                  {props.type == 'received' && 
                    <>
                      <RxCheckCircled className="connectionIcon" id='checkIcon' onClick={acceptHandler} style={{marginLeft:'2rem', marginTop:'.5rem'}}/>
                      <RxCrossCircled className="connectionIcon" id='crossIcon' onClick={rejectHandler} style={{marginLeft:'0.2rem',marginTop:'.5rem'}}/>
                    </>
                  }
                  {props.type == 'sent' && 
                      <TiCancel className="connectionIcon" id='cancelIcon' onClick={cancelHandler} style={{marginLeft:'1rem',marginTop:'.5rem'}}/>
                  }
                  {props.type == 'possible' &&
                      <MdAddLink className="connectionIcon" id='addConnectionIcon' onClick={sendConnectionRequestHandler} style={{marginLeft:'1rem',marginTop:'.5rem'}}/>
                  }
                </>
              }
              </Col>
            </div>
          </Card.Body>
        </Row>
      </Card>
    </>
  );
};

export default ConnectionCard;
