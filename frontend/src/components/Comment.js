// Importing necessary packages from 'mdb-react-ui-kit' and 'react'
import React from 'react';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";

// Functional component Comment with props 'author', 'content', 'createdAt'
const Comment = ({ author, content, createdAt }) => {
  return (
    // Using MDBContainer and MDBRow to create a container and row to hold the comment
    <MDBContainer>
        <MDBRow> 
    // Using MDBCard from MDBReact to create a card for the comment
        <MDBCard className="mb-4">
                <MDBCardBody>
                  // Adding a prompt for users to add their note
                  <p>Type your note, and hit enter to add it</p>
                  
                  // Dividing the card into two parts - left and right
                  <div className="d-flex justify-content-between">
    
                    // Left part with the author's image and name
                    <div className="d-flex flex-row align-items-center">
                      <MDBCardImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                        alt="avatar"
                        width="25"
                        height="25"
                      />
                      <p className="small mb-0 ms-2">Martha</p>
                    </div>
    
                     // Right part with upvote count and an upvote icon
                    <div className="d-flex flex-row align-items-center">
                      <p className="small text-muted mb-0">Upvote?</p>
                      <MDBIcon
                        far
                        icon="thumbs-up mx-2 fa-xs text-black"
                        style={{ marginTop: "-0.16rem" }}
                      />
                      <p className="small text-muted mb-0">3</p>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
        </MDBRow>
    </MDBContainer>
  );
};

export default Comment;
