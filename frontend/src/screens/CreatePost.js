import React, { useState, Component } from 'react'
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
    MDBFile
  } from 'mdb-react-ui-kit';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {Container, Row} from 'react-bootstrap';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import{ create_post } from '../actions/postActions'
import '../Assets/css/Newsfeed.css';

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
      console.log('create_post: ',userInfo.email)
      dispatch(create_post(userInfo.email,title, content, image))
      navigate(from)
  }

  return (
      <div className='background'>
        <div className='formContainer'>
        <Container className="justify-content-md-center">
        {userInfo ? (
          <Container >
            <Form className='padd' onSubmit={submitHandler}>
            <h1 id='createPostH1'>Create a Post</h1>
              <FormGroup>
                <Label for="postTitle">Post Title</Label>
                <Input type="text" value={title}  onChange={(e)=> setTitle(e.target.value)} placeholder="Enter post title" required/>
              </FormGroup>

              <FormGroup>
                <Label for="postBody">Post Body</Label>
                <Input type="textarea" value={content}  onChange={(e)=> setContent(e.target.value)} placeholder="Enter your post contents here" required/>
              </FormGroup>

              <FormGroup>
                <Label for="postImage">Attach an Image</Label>
                <Input type="file" value={image}  onChange={(e)=> setImage(e.target.value)}/>
              </FormGroup>
           
              <Button id='submit' className='createPostButton' type='submit'>Create Post</Button>
            </Form>
          </Container>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
          </Alert>

        </Row>)}
        
        
      </Container>
        </div>

      </div>  )

}
export default CreatePost;
