import "../Assets/css/rchat.css";
import React from "react";

/*
* @description: Builds a chat message for the current connected partner.
* @parameters:
*   -> Object props: Contains component data configurations (Read Only).
* @return: JSXObject
*/
export default function RightChat (props) {
    // Builds this component by using JSX formatting.
    return <div className = "right-chat-msg" style = {{marginTop: (props.top + "px"), marginBottom: (props.bottom + "px")}}>
        {/* Apply a blank space and chat message data */}
        <div className = "crblank-space"></div><div className = "chat-msg-data"><label id = "chat-text">{props.text}</label></div>
        {/* Guest profil */}
        <div className = "user-profil">{typeof props.profil === "string" && <img src = {props.profil} width = "32px" height = "32px" alt = ''/>}</div>
    </div>;
}