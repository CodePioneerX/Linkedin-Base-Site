import axios from 'axios';
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap"; 
import { useDispatch, useSelector } from "react-redux";
import Profil1 from "../Assets/images/profil_1.png";
import Profil7 from "../Assets/images/profil_2.png";
import Profil2 from "../Assets/images/profil_3.png";
import Profil3 from "../Assets/images/profil_4.png";
import Profil4 from "../Assets/images/profil_5.png";
import Profil5 from "../Assets/images/profil_6.png";
import Profil6 from "../Assets/images/profil_7.png";
import Profil8 from "../Assets/images/profil_8.png";
import Profil9 from "../Assets/images/profil_9.png";
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
    const [message, setMessage] = useState('');
    const [chat_id, setChatId] = useState('');
  
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    console.log("user info from body");
    console.log(userInfo);
  
    useEffect(() => {
      async function fetchData() {
        console.log("user id for the post request : ");
        console.log(userInfo.id);
        const response = await axios.get(
          `http://localhost:8000/direct_messages/${userInfo.email}/`
        );
        setChatId(response.data[0].id);
        setReciever(response.data[0].messages[0].from_user);
        setSender(response.data[0].messages[0].to_user);
        console.log("response from body");
        console.log(response.data);
        setChats(processMessages(response.data));

      }
  
      fetchData();
    }, [userInfo.id]);

    const getRandomImage = () => {
      const images = [
        Profil1,
        Profil2,
        Profil3,
        Profil4,
        Profil5,
        Profil6,
        Profil7,
        Profil8,
        Profil9
      ];
      return images[Math.floor(Math.random() * images.length)];
    };
    
    // const processMessages = (rawMessages) => {
    //   let chats = [];
    
    //   rawMessages.forEach((msg) => {
    //     console.log("MSG");
    //     console.log(msg);
    //     setChatId(msg.id);
    
    //     msg.messages.forEach((message) => {
    //       const existingChatIndex = chats.findIndex(
    //         (chat) => chat.name === msg.name
    //       );
    //       setReciever(message.from_user);
    //       setSender(message.to_user);
    
    //       const messageObj = {
    //         is_contact: message.from_user !== userInfo.id,
    //         text: message.content,
    //       };
    
    //       if (existingChatIndex !== -1) {
    //         chats[existingChatIndex].data[0].messages.push(messageObj);
    //       } else {
    //         chats.push({
    //           label: message.content.slice(0,5)+'...',
    //           name: message.to_user,
    //           date: message.timestamp.slice(0,10), // Replace with actual date if needed
    //           profil: getRandomImage(), // Replace with actual profile image if needed
    //           data: [
    //             {
    //               datetime: message.timestamp, // Replace with actual date if needed
    //               messages: [messageObj],
    //             },
    //           ],
    //         });
    //       }
    //     });
    //   });
    
    //   return chats;
    // };
    const processMessages = (rawMessages) => {
      let chats = [];
    
      rawMessages.forEach((msg) => {
        const existingChatIndex = chats.findIndex(
          (chat) => chat.name === msg.name
        );
        if (existingChatIndex !== -1) {
          const messageObjs = msg.messages.map((message) => {
            return {
              is_contact: message.from_user != userInfo.email,
              text: message.content,
            };
          });
          chats[existingChatIndex].data.push({
            datetime: msg.messages[0].timestamp,
            messages: messageObjs,
          });
        } else {
          const messageObjs = msg.messages.map((message) => {
            return {
              is_contact: message.from_user != userInfo.email,
              text: message.content,
            };
          });
          chats.push({
            label: msg.messages[0].content.slice(0, 5) + "...",
            name: msg.name,
            date: msg.messages[0].timestamp.slice(0, 10),
            profil: getRandomImage(),
            data: [
              {
                datetime: msg.messages[0].timestamp,
                messages: messageObjs,
              },
            ],
          });
        }
      });
    
      return chats;
    };
    

      const __set_active_contact_index = (new_index) => {
        setActiveIndex(new_index);
      };

    // }
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      }





      const __send_message = async (datetime, is_contact, message) => {

        // Get the CSRF token
        const csrfToken = getCookie('csrftoken');
        var to_user_id = reciever;
        var from_user_id = sender;

        if (sender != userInfo.email){
          to_user_id = sender;
          from_user_id = reciever;
        }


        setTimeout(() => chat_context.current.scroll_to_bottom(), 100);
    
        // Send the message to the server
        const response = await fetch(`http://localhost:8000/chat/${chat_id}/send_message/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include your authentication token if needed
            //'Authorization': 'Token <your_auth_token>'
          },
          
          body: JSON.stringify({
            chat: chat_id,
            from_user: from_user_id,
            to_user: to_user_id,
            content: message
          })
        });
      
        if (response.ok) {
          const data = await response.json();
          console.log('Message sent:', data);
          window.location.reload(false);
          setTimeout(() => chat_context.current.scroll_to_bottom(), 100);
        } else {
          console.error('Error sending message:', response.status, response.statusText);
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