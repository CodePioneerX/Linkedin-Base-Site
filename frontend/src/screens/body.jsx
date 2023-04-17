import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap"; 
import { useDispatch, useSelector } from "react-redux";
import Profil1 from "../Assets/images/profil_1.png";
// import Profil7 from "../Assets/images/profil_2.png";
import Profil2 from "../Assets/images/profil_3.png";
// import Profil3 from "../Assets/images/profil_4.png";
// import Profil4 from "../Assets/images/profil_5.png";
// import Profil5 from "../Assets/images/profil_6.png";
// import Profil6 from "../Assets/images/profil_7.png";
// import Profil8 from "../Assets/images/profil_8.png";
// import Profil9 from "../Assets/images/profil_9.png";
import ChatMessagesHeader from "./msgheader.jsx";
import ChatMessageEditor from "./msgeditor.jsx";
import DateTime from "../libs/datetime.js";
import Contacts from "./contacts.jsx";
import ChatContext from "./chat.jsx";
import lodash from "lodash";
import "../Assets/css/body.css";

/*
* @description: Creates application body view.
* @type: UI
*/

const Body = (props) => {
    const chat_context = useRef();
    const [active_index, setActiveIndex] = useState(0);
    const [chats, setChats] = useState([]);
    const [reciever, setReciever] = useState('');
    const [sender, setSender] = useState('');
  
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    console.log("user info from body");
    console.log(userInfo);
  
    useEffect(() => {
      async function fetchData() {
        console.log("user id for the post request : ");
        console.log(userInfo.id);
        const response = await axios.get(
          `http://localhost:8000/direct_messages/user/${userInfo.id}/`
        );
        console.log("response from body");
        console.log(response.data);
        setChats(processMessages(response.data));

      }
  
      fetchData();
    }, [userInfo.id]);
    
    const processMessages = (rawMessages) => {
        // Process raw messages and convert them into the format expected by the component
        // This is just an example, you might need to adjust it based on your actual data
        let chats = [];
    
        rawMessages.forEach((msg) => {
          const existingChatIndex = chats.findIndex(
            (chat) => chat.name === msg.reciever
          );
          setReciever(msg.reciever);
          setSender(msg.sender);
    
          const messageObj = {
            is_contact: msg.sender.id !== userInfo.id,
            text: msg.content,
          };
    
          if (existingChatIndex !== -1) {
            chats[existingChatIndex].data[0].messages.push(messageObj);
          } else {
            chats.push({
              label: "New chat",
              name: msg.reciever,
              date: "9/3/2022", // Replace with actual date if needed
              profil: Profil2, // Replace with actual profile image if needed
              data: [
                {
                  datetime: "August 21, 2022 19:45", // Replace with actual date if needed
                  messages: [messageObj],
                },
              ],
            });
          }
        });
    
        return chats;
      }

      const __set_active_contact_index = (new_index) => {
        setActiveIndex(new_index);
      };

    //   const __send_message = (datetime, is_contact, message) => {
    //     // Gets chats data.
    //     let chats = lodash.cloneDeep (chats), today = (datetime.split (',')[0] + ", " + new Date ().getFullYear ());
    //     // Gets chat datetime index.
    //     let index = chats[active_index].data.findLastIndex (item => {
    //         // Returns the imposed constraint.
    //         return ((item.datetime.split (',')[0] + ", " + new Date ().getFullYear ()) === today);
    //     });
    //     // The given datetime is it defined ?
    //     if (index > -1) chats[active_index].data[index].messages.push ({is_contact: is_contact, text: message});
    //     // Adds the current message with the given datetime for today.
    //     else chats[active_index].data.push ({datetime: DateTime.get_datetime (), messages: [{is_contact: is_contact, text: message}]});
    //     // Updates the global state.
    //     this.setState ({chats: chats});
    //     // Moves the scrollbar at the full bottom.
    //     setTimeout (() => chat_context.current.scroll_to_bottom (), 100);
    // }
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }

    const __send_message = async (datetime, is_contact, message) => {

    // Get the CSRF token
    const csrfToken = getCookie('csrftoken');

    setTimeout(() => chat_context.current.scroll_to_bottom(), 100);

    // Send the message to the server
    try {
        const response = await axios.post(
        'http://localhost:8000/direct_messages/',
        {
            //csrfmiddlewaretoken: csrfToken, // Add the CSRF token to the request body
            id: userInfo.id,
            sender: sender,
            receiver: reciever,
            //reciever: reciever,
            receiver_id: 2, // Assuming 0 is a valid reciever_id
            content: message,
        },
        {
            headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${userInfo.token}`, // Uncomment and add your access token if you need authorization
            'X-CSRFToken': csrfToken, // Add the CSRF token to the headers
            },
        }
        );
        console.log('Message sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending message:', error);
    }
    };


return (
        <div className="chat-workspace">
          {/* Global container */}
          <br />
          <div className="chat-container">
            {/* Left arrow container */}
            <div
              className="left-arrow"
              title="Back to the previous page."
            >
              {/* Vector image */}
              <svg
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
                fill="#343434"
              >
                <polygon
                  fillRule="evenodd"
                  points={`6.414 13 12.707 19.293 11.293 
                          20.707 2.586 12 11.293 3.293 12.707 4.707 6.414 11 21 11 21 13`}
                />
              </svg>
            </div>
            {/* Availables users contacts */}
            <Contacts
                onSettings={() => props.onSettings()}
                chatContext={chat_context}
                contacts={chats}
                setIndex={__set_active_contact_index}
                />
            {/* Messages worksapce */}
            {chats.length > 0 &&
              active_index < chats.length && (
                <div className="messages-workspace">
                  {/* Messages header container */}
                  <ChatMessagesHeader
                    contact={chats[active_index]}
                  />
                  {/* Chat context */}
                  <ChatContext
                    chats={chats[active_index].data}
                    userProfil={Profil1}
                    contactProfil={
                      chats[active_index].profil
                    }
                    ref={chat_context}
                  />
                  {/* Message editor */}
                  <ChatMessageEditor
                    sendMessage={__send_message}
                  />
                </div>
              )}
          </div>
        </div>

  );
};

export default Body;