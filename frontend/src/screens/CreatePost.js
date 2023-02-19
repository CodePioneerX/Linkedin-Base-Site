import React, { useState, Component } from 'react'
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBFile
  } from 'mdb-react-ui-kit';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import { Form } from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import{ create_post } from '../actions/postActions'

function CreatePost() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [author, setAuthor] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')

  const { from } = location.state

  const submitHandler = (e) => {
      e.preventDefault()
      dispatch(create_post(userInfo.email,title, content, image))
      navigate(from)
  }

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <Container className='padd'>
            <h1>Create a Post</h1>
            <Form className='padd' onSubmit={submitHandler}>
                <MDBRow className='mb-4'>
                    <MDBCol>
                      <MDBInput disabled id='form6Example1' label='Contact name' value={userLogin.userInfo.username} onChange={(e)=> setAuthor(e.target.value)} />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput disabled id='form6Example2' label='Contact email' value={userLogin.userInfo.email} onChange={(e)=> setEmail(e.target.value)}/>
                    </MDBCol>
                </MDBRow>

                <MDBInput wrapperClass='mb-4' id='form6Example3' label='Title'  value={title} onChange={(e)=> setTitle(e.target.value)} />
                <MDBInput wrapperClass='mb-4' id='form6Example8' rows={4} label='Content'  value={content} onChange={(e)=> setContent(e.target.value)}/>
           
                <div className='mb-4'>
                    <MDBFile wrapperClass='mb-4' type="file" label='Attach an image' id='customFile' onChange={(e)=> setImage(e.target.files[0])}/>
                </div>

                <MDBBtn id='create-post-button' className='mb-4 padd' type='submit'>
                    Create a Post
                </MDBBtn>
            </Form>
          </Container>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
        
        
      </Container>
  )

}
export default CreatePost;
