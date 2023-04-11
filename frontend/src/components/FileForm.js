import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/App.css';
import { MdClose } from 'react-icons/md';



const FileForm = ({ fileForm,setFileForm }) => {

//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;

//Holds and sets the value
const [resume, setResume] = useState(null);    
const [coverLetter, setCoverLetter]= useState(null); 

//Handle the submission, send the file to the backend
const FileUpload = (e)=>{
    e.preventDefault();
    console.log(resume);
    console.log(coverLetter);
    setFileForm(prev => !prev)
}

return (
   <>
   {fileForm?
   (<div className='file-form-background' >
      <div className='file-form-wrapper' >
        <div>
          <Form className='file-form-content'>
          <FormGroup className='FileInputContent'>
            <h2 className='FileInputText'>Resume</h2>
            <Label className='Resume' for="Resume"/>
            <input type='file' name="Resume" id="Resume" 
            onChange={(e)=> {setResume(e.target.files[0])}}/>
            </FormGroup>
          <FormGroup className='FileInputContent'>
            <h2 className='FileInputText'>Cover Letter</h2>
            <Label className='CoverLetter' for="CoverLetter"/>
            <input type='file' name="CoverLetter" id="CoverLetter" 
            onChange={(e)=> {setCoverLetter(e.target.files[0])}}/>
            </FormGroup>
          <button className='file-form-button' onClick={FileUpload}>Save</button>
          </Form>
        </div>
        <MdClose className='close-file-form-button'
          onClick={() => setFileForm(prev => !prev)}
        />
      </div>
  </div>)
   :<></>}
   </>
);
};

export default FileForm;