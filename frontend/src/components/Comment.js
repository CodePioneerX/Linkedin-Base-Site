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
const Comment = ({ author, content, createdAt }) => {
  return (
    // <div style={{ marginBottom: 20 }}>
    //   <p>
    //     <strong>{author}</strong> 
    //   </p>
    //   <p>
    //     <strong>Content:</strong> {content}
    //   </p>
    //   <p>
    //     <strong>Created at:</strong> {createdAt}
    //   </p>
    // </div>
    <MDBContainer>
        <MDBRow> 
        <MDBCard className="mb-4">
                <MDBCardBody>
                  <p>Type your note, and hit enter to add it</p>

                  <div className="d-flex justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                      <MDBCardImage
                        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp"
                        alt="avatar"
                        width="25"
                        height="25"
                      />
                      <p className="small mb-0 ms-2">Martha</p>
                    </div>
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
