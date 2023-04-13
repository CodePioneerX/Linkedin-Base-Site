
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import '../Assets/css/Login.css';
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { update_profile } from '../actions/userActions'

export const EditProfileForm =(profile)=>{
    const [name, setName] = useState(profile.profile.name)
    const [title, setTitle] = useState(profile.profile.title)
    const [city, setCity] = useState(profile.profile.city)
    const [about, setAbout] = useState(profile.profile.about)
    const [experience, setExperience] = useState(profile.profile.experience)
    const [education, setEducation] = useState(profile.profile.education)
    const [image, setImage] = useState(profile.profile.image)
    const [imagePath, setImagePath] = useState(profile.profile.image)
    const [work, setWork] = useState(profile.profile.work)
    const [volunteering, setVolunteering] = useState(profile.profile.volunteering)
    const [courses, setCourses] = useState(profile.profile.courses)
    const [projects, setProjects] = useState(profile.profile.projects)
    const [awards, setAwards] = useState(profile.profile.awards)
    const [languages, setLanguages] = useState(profile.profile.languages)

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    
    const dispatch = useDispatch();
    
    const submitHandler = (e)=>{
        e.preventDefault()
        if (name ===""){
            alert("Name cannot be empty!")
            return;
        }
        dispatch(update_profile(userInfo.id, name, title, city, about, experience, education, image, work, volunteering, courses, projects, awards, languages))
        
        window.location.reload(false);
    }

    const cancelHandler = (e) => {
        e.preventDefault()
        window.location.reload(false)
    }
    
    return (
        <div>
            <div id='editProfileForm'>
                <h2>Edit Your Profile</h2>
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
                <Label className='labelE' for="work">Work</Label>
                <textarea  className= 'form-control'
                name="work" id="work" value = {work} placeholder={profile.profile.work} 
                onChange={(e)=> setWork(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                <Label className='labelE' for="volunteering">Volunteering</Label>
                <textarea  className= 'form-control'
                name="volunteering" id="volunteering" value = {volunteering} placeholder={profile.profile.volunteering} 
                onChange={(e)=> setVolunteering(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                <Label className='labelE' for="courses">Courses</Label>
                <textarea  className= 'form-control'
                name="courses" id="courses" value = {courses} placeholder={profile.profile.courses} 
                onChange={(e)=> setCourses(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                <Label className='labelE' for="projects">Projects</Label>
                <textarea  className= 'form-control'
                name="projects" id="projects" value = {projects} placeholder={profile.profile.projects} 
                onChange={(e)=> setProjects(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                <Label className='labelE' for="awards">Awards</Label>
                <textarea  className= 'form-control'
                name="awards" id="awards" value = {awards} placeholder={profile.profile.awards} 
                onChange={(e)=> setAwards(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                <Label className='labelE' for="languages">Languages</Label>
                <textarea  className= 'form-control'
                name="languages" id="languages" value = {languages} placeholder={profile.profile.languages} 
                onChange={(e)=> setLanguages(e.target.value)}/>
                </FormGroup>


                <FormGroup className='mb-4'>
                <div className="profile-header">
                    <p className='labelE'>Your profile image now</p>
                    <img src={profile.profile.image} className='editImg' />
                </div>
                </FormGroup>
                <FormGroup className='mb-4'>
                <Label className='labelE ' for="image">Choose your new profile image</Label>
                <input type='file' name="image" id="image" 
                onChange={(e)=> {setImage(e.target.files[0])
                                setImagePath('/images/'+ e.target.files[0].name)}}/>
                </FormGroup>

                <Row className='editButtonContainer'>
                <Col xs={12} md={6} className='text-left'>
                    <Button type='submit' className='editSaveButton' onClick={submitHandler}>
                    Save
                    </Button>
                </Col>
                <Col xs={12} md={6} className='text-right'>
                    <Button className='editCancelButton' onClick={cancelHandler}>
                    Cancel
                    </Button>
                </Col>
                </Row>

                </Form>

            </div>
        </div>
    )
}
