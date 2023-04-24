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
    const [image, setImage] = useState(post.post.image)
    
    // Get the user login state from Redux
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;

    // Get the dispatch function from Redux
    const dispatch = useDispatch();
    
     // Handle the submit event for the form
    const submitHandler = (e) =>{
        e.preventDefault()

        if (image == post.post.image) {
            setImage('')
        }

        // Dispatch an action to update the post
        dispatch(update_post(post.post.id, title, content, image))
        
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
    return (
        <div style={{minHeight: "100vh"}}>
            <div className='editPostContainer'>
        <h1>Edit Your Post</h1>
        <hr style={{ width: "100%", marginTop: "3%", marginBottom: "3%"}}/>
        <Form onSubmit={submitHandler}>
            <FormGroup className='mb-4'>
            <Label className='labelE' for="title" >Post Title</Label>
                <Input name="title" value = {title} id="name" 
                onChange={(e)=> setTitle(e.target.value)}/>
            </FormGroup>
            <FormGroup className='mb-4'>
                <Label className='labelE' for="content">Post Contents</Label>
                <textarea name="content" value = {content} id="content" onChange={(e)=> setContent(e.target.value)} rows="4" style={{width: "100%", borderColor:"#D3D3D3", borderRadius:"5px"}}></textarea>
            </FormGroup>
            {post.post.image && image === post.post.image && 
            <>
                <Row>
                    <Label className='labelE'>Existing Image:</Label>
                    <Col xs={12} style={{display: 'flex', justifyContent: 'center'}}>                        
                        <img src={'http://insightwearai.sytes.net:8000'+post.post.image} alt="test alt image text" style={{ width: "95%", height: "auto", paddingBottom: "1rem" }} />
                    </Col>
                </Row>
            </>}
            <FormGroup>
                <Label className='labelE' for="postImage">Upload a New Image</Label>
                <Input type="file" onChange={(e)=> setImage(e.target.files[0])}/>
            </FormGroup>
            
        
            <div id='button_column' >
                <Row className='editButtonContainer justify-content-center'>
                    <Col xs={12} md={4} className='buttonCol' style={{paddingRight: "0px"}}>
                        <Button type='submit' className='editSaveButton'> Save </Button>
                    </Col>
                    <Col xs={12} md={4} className='buttonCol' style={{paddingRight: "0px"}}>
                        <Button className='editCancelButton' onClick={cancelHandler}>Cancel</Button>
                    </Col>
                    <Col xs={12} md={4} className='buttonCol' style={{paddingRight: "0px"}}>
                        <Button className='editDeleteButton' onClick={deleteHandler}>Delete</Button>
                    </Col>
                </Row>
            </div>
        </Form>
    </div>

        </div>
    );

}
