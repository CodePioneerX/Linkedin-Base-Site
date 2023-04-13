import React, { useState, useEffect,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {  Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import '../Assets/css/App.css';
import { MdClose } from 'react-icons/md';



const FileForm = ({ fileForm,setFileForm }) => {

//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;
const resumeRef = useRef();
const coverLetterRef = useRef();


//Holds and sets the value
const [resume, setResume] = useState();    
const [coverLetter, setCoverLetter]= useState(); 


//Handle the submission, send the file to the backend
const FileUpload = (e)=>{
    e.preventDefault();
    if(!resume){
      if(!coverLetter){
      alert("The file inputs cannot be all empty!");
      return;
      }
    }
    console.log(resume);
    console.log(coverLetter);
    // setFileForm(prev => !prev)
}

const FileClear = (e)=>{
  e.preventDefault();
  resumeRef.current.value = "";
  coverLetterRef.current.value = "";
  setResume();
  setCoverLetter();
  console.log(resume);
  console.log(coverLetter);

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
            <input type='file' name="Resume" id="Resume" ref={resumeRef}
            onChange={(e)=> {setResume(e.target.files[0])}}/>
            </FormGroup>
          <FormGroup className='FileInputContent'>
            <h2 className='FileInputText'>Cover Letter</h2>
            <Label className='CoverLetter' for="CoverLetter"/>
            <input type='file' name="CoverLetter" id="CoverLetter" ref={coverLetterRef}
            onChange={(e)=> {setCoverLetter(e.target.files[0])}}/>
          </FormGroup>
            <button className='file-form-button' onClick={FileUpload}>Save</button>
            <button className='file-form-clear-button' onClick={FileClear}>Clear</button>
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