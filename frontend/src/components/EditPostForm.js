import Button from 'react-bootstrap/Button';
import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { delete_post, update_post } from '../actions/postActions'

// Define the EditPostForm component
export const EditPostForm = (post) => {

    // Define state variables for the title and content fields
    const [title, setTitle] = useState(post.post.title)
    const [content, setContent] = useState(post.post.content)
    
    // Get the user login state from Redux
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;

    // Get the dispatch function from Redux
    const dispatch = useDispatch();
    
     // Handle the submit event for the form
    const submitHandler = (e) =>{
        e.preventDefault()
        
        // Dispatch an action to update the post
        dispatch(update_post(post.post.id, title, content))
        
         // Reload the page to reflect the updated post
        window.location.reload(false);
    }
    
    // Handle the cancel event for the form
    const cancelHandler = (e) => {
        e.preventDefault()
          // Reload the page to discard any changes made to the post
        window.location.reload(false)
    }
    
    // Handle the delete event for the form
    const deleteHandler = (e) => {
        e.preventDefault()
        
        // Confirm with the user before deleting the post
        alert('Are you sure you want to delete this post?')
        
        // Dispatch an action to delete the post
        dispatch(delete_post(post.post.id))
        
         // Reload the page to reflect the deleted post
        window.location.reload(false)
    }
    
    // Render the form to edit the post
    return <div>
        <h2>Edit Your Post</h2>
        <Form>
            <FormGroup className='mb-4'>
            <Label className='labelE' for="title" >Title</Label>
                <Input  name="title" value = {title} id="name" 
                onChange={(e)=> setTitle(e.target.value)}/>
            </FormGroup>
            <FormGroup className='mb-4'>
            <Label className='labelE' for="content">Content</Label>
                <Input  name="content" value = {content} id="content"
                onChange={(e)=> setContent(e.target.value)}/>
            </FormGroup>
        
            <Row className='editButtonContainer'>
                <Col xs={12} md={4}>
                    <Button type = 'submit' className='editSaveButton' onClick={submitHandler}> Save </Button>
                </Col>
                <Col xs={12} md={4}>
                    <Button className='editCancelButton' onClick={cancelHandler}>Cancel</Button>
                </Col>
                <Col xs={12} md={4}>
                    <Button className='editDeleteButton' onClick={deleteHandler}>Delete</Button>
                </Col>
            </Row>
        </Form>
    </div>
}
