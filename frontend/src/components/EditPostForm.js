import Button from 'react-bootstrap/Button';
import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { delete_post, update_post } from '../actions/postActions'

export const EditPostForm = (post) => {
    const [title, setTitle] = useState(post.post.title)
    const [content, setContent] = useState(post.post.content)

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;

    const dispatch = useDispatch();

    const submitHandler = (e) =>{
        e.preventDefault()
        
        dispatch(update_post(post.post.id, title, content))

        window.location.reload(false);
    }

    const cancelHandler = (e) => {
        e.preventDefault()
        window.location.reload(false)
    }

    const deleteHandler = (e) => {
        e.preventDefault()
        alert('Are you sure you want to delete this post?')
        dispatch(delete_post(post.post.id))
        window.location.reload(false)
    }
    
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