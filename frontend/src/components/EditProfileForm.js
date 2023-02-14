

import React, { useState, useEffect} from 'react'
import '../Assets/css/Login.css';
import { Button, Form, FormGroup, Label, Input} from 'reactstrap';

export const EditProfileForm =(profile)=>{
    const [name, setName] = useState(profile.profile.name)
    const [title, setTitle] = useState(profile.profile.title)
    const [city, setCity] = useState(profile.profile.city)
    const [about, setAbout] = useState(profile.profile.about)
    const [experience, setExperience] = useState(profile.profile.experience)
    const [education, setEducation] = useState(profile.profile.education)
    const [image, setImage] = useState(profile.profile.image)

    const handleEdit = ()=>{
    console.log(name)
    console.log(title)
    console.log(city)
    console.log(about)
    console.log(experience)
    console.log(education)
    console.log(image)
    profile.quitEditor()
    }
    
    return <div>
        <Form >
        <FormGroup className='mb-4'>
        <Label className='labelE' for="name" >User Name</Label>
            <Input  name="name" value = {name} id="name" placeholder={profile.profile.name} 
            onChange={(e)=> setName(e.target.value)}/>
        </FormGroup>
        <FormGroup className='mb-4'>
        <Label className='labelE' for="title">User Title</Label>
            <Input  name="title" value = {title} id="title" placeholder={profile.profile.title} 
            onChange={(e)=> setTitle(e.target.value)}/>
        </FormGroup>
        <FormGroup className='mb-4'>
        <Label className='labelE' for="city">City</Label>
            <Input  name="city" value = {city} id="city" placeholder={profile.profile.city} 
            onChange={(e)=> setCity(e.target.value)}/>
        </FormGroup>
        <FormGroup className='mb-4'>
        <Label className='labelE' for="about">About me</Label>
            <textarea  className= 'form-control' 
            name="about" id="about" value = {about} placeholder={profile.profile.about} 
            onChange={(e)=> setAbout(e.target.value)}/>
        </FormGroup>
        <FormGroup className='mb-4'>
        <Label className='labelE' for="experience">Experience</Label>
            <textarea className= 'form-control'
            name="experience" id="experience" value= {experience} placeholder={profile.profile.experience} 
            onChange={(e)=> setExperience(e.target.value)}/>
        </FormGroup>
        <FormGroup className='mb-4'>
        <Label className='labelE' for="education">Education</Label>
            <textarea  className= 'form-control'
            name="education" id="education" value = {education} placeholder={profile.profile.education} 
            onChange={(e)=> setEducation(e.target.value)}/>
        </FormGroup>
        <FormGroup className='mb-4'>
        <div className="profile-header">
              <p className='labelE'>Your profile image now</p>
              <img src={profile.profile.image} value= {image} className='editImg' 
              onChange={(e)=> setImage(e.target.value)}/>
        </div>
        </FormGroup>
        <FormGroup className='mb-4'>
        <Label className='labelE ' for="image">Choose your new profile image</Label>
            <input type='file' name="image" id="image" />
        </FormGroup>
        <div className='editButtonContainer'>
        <Button className='editButton' onClick={handleEdit}>Save</Button>
        <Button className='editCancelButton' onClick={profile.quitEditor}>Cancel</Button>
        </div>
        </Form>
    </div>
}