import Button from 'react-bootstrap/Button';
import React, { useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import {  Form, FormGroup, Label, Input} from 'reactstrap';
import axios from 'axios';
import { update_post } from '../actions/userActions'

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
        
            <div className='editButtonContainer'>
                <Button type = 'submit' className='editButton' onClick={submitHandler}> Save </Button>
                <Button className='editCancelButton' onClick={post.quitPostEditor}>Cancel</Button>
            </div>
        </Form>
    </div>
} 