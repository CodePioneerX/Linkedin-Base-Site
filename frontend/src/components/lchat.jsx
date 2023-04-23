import "../Assets/css/lchat.css";
import React from "react";

/*
* @description: Builds a chat message for the current connected user.
* @parameters:
*   -> Object props: Contains component data configurations (Read Only).
* @return: JSXObject
*/
export default function LeftChat (props) {
    // Builds this component by using JSX formatting.
    return <div className = "left-chat-msg" style = {{marginTop: (props.top + "px"), marginBottom: (props.bottom + "px")}}>
        {/* Guest profil */}
        <div className = "user-profil">{typeof props.profil === "string" && <img src = {props.profil} width = "32px" height = "32px" alt = ''/>}</div>
        {/* Chat message data */}
        <div className = "chat-msg-data"><label id = "chat-text">{props.text}</label></div>
    </div>;
}