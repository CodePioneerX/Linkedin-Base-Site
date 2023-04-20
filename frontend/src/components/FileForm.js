import React, { useState, useEffect,useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {  Form, FormGroup, Label, Input, Row, Col, Button } from 'reactstrap';
import '../Assets/css/App.css';
import { MdClose } from 'react-icons/md';
import { upload_document, remove_document } from '../actions/userActions'



const FileForm = ({ fileForm ,setFileForm, oldResume, oldCoverLetter }) => {

//Get the user information from the store
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;
const dispatch = useDispatch();
const resumeRef = useRef();
const coverLetterRef = useRef();


//Holds and sets the value
const [resume, setResume] = useState();    
const [coverLetter, setCoverLetter]= useState(); 
const [resumeRemoved, setResumeRemoved] = useState(false)
const [coverLetterRemoved, setCoverLetterRemoved] = useState(false)

//Handle the submission, send the file to the backend
const FileUpload = (e)=>{
    e.preventDefault();
    if(!resume){
      if(!coverLetter){
      alert("The file inputs cannot be all empty!");
      return;
      }
    }
    dispatch(upload_document(userInfo.id, resume, coverLetter))
    setFileForm(prev => !prev)
}

const FileClear = (e)=>{
  e.preventDefault();
  resumeRef.current.value = "";
  coverLetterRef.current.value = "";
  setResume();
  setCoverLetter();
}

const removeDocument = (e, type) => {
  e.preventDefault();
  dispatch(remove_document(userInfo.id, type))

  if (type === 'resume') {
    setResumeRemoved(true)
  }
  if (type === 'cover_letter') {
    setCoverLetterRemoved(true)
  }

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
            {oldResume ?
            <>
              {!resumeRemoved &&
              <>
                <div>
                  <p>You've already uploaded a resume, you can <a href={'http://localhost:8000'+oldResume} download>download it here</a>.</p>
                </div>
                <div>
                    <p>Click <a href={''} onClick={(e) => removeDocument(e, 'resume')}>here</a> to remove your old resume.</p>    
                </div>
              </>}
            </> : 
            <p>No resume currently on file.</p>
            }
            <input type='file' name="Resume" id="Resume" ref={resumeRef}
            onChange={(e)=> {setResume(e.target.files[0])}}/>
          </FormGroup>
          <FormGroup className='FileInputContent'>
            <h2 className='FileInputText'>Cover Letter</h2>
            <Label className='CoverLetter' for="CoverLetter"/>
            {oldCoverLetter? 
            <>
              {!coverLetterRemoved && 
              <>
                <div>
                  <p>You've already uploaded a cover letter, you can <a href={'http://localhost:8000'+oldCoverLetter} download>download it here</a>.</p>
                </div>
                <div>
                  <p>Click <a href={''} onClick={(e) => removeDocument(e, 'cover_letter')}>here</a> to remove your old cover letter.</p>
                </div>
              </>}
            </> : 
            <p>No cover letter currently on file.</p>
            }
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