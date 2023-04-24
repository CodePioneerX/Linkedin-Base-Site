import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Button, Col} from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import JobCard from '../components/JobCard';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Alert from 'react-bootstrap/Alert';
import {  Form, FormGroup, Label, Input} from 'reactstrap';
import { create_job_alert } from '../actions/jobActions';

function SearchScreen() {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { name } = useParams();
  const [searchPeople, setSearchPeople] = useState([]);
  const [searchJob, setSearchJob] = useState([]);
  //variable for entering filter form
  const [filterForm, setFilterForm] = useState(false);
  //variables for filter feature
  const [company, setCompany] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryMin, setSalaryMin] = useState(0);
  const [salaryMax, setSalaryMax] = useState(99999999);
  const [salaryType, setSalaryType] = useState('');
  const [location, setLocation] = useState('');
  const [employmentTerm, setEmploymentTerm] = useState('');
  const [listingType, setListingType] = useState('');
  const [remote, setRemote] = useState('');

  //variable for showing if the user use the filter function
  const [useFilter, setUseFilter] = useState(false);
  const [jobMode, setJobMode] = useState(false);

  function handleClick(e) {
    if(e =='People'){
    setJobMode(false);}
    if(e =='Jobs'){
    setJobMode(true);}
    
    //result will be the eventKey of the tab you clicked on.
    
    // `homeTab` (when clicked on home tab)
    // `profileTab` (when clicked on profile tab)
    // `constactTab` (when clicked on Contact tab)
}

//get the original searched result without applying any filters
  useEffect(() => {
    if (name) {
        console.log(name)
      axios.get('http://insightwearai.sytes.net:8000/api/search/',
      { params:{   
            'searchValue': name, 
            'company': company,
            'location': location, 
            'jobType': jobType,
            'employmentTerm': employmentTerm, 
            'salaryMin': salaryMin,
            'salaryMax': salaryMax,
            'salaryType': salaryType, 
            'listingType': listingType,
            'remote': remote}}
            )
        .then(response => {
            setSearchPeople(response.data.users);
            setSearchJob(response.data.jobs);
            console.log(response.data)
            setUseFilter(false)
        }
        )
        .catch(error => {
            console.log('error:',error);
        }
        )
    }
    
  }, [name]);


//Apply the filter value and update the search result
  const applyFilter = async (e)=>{
    e.preventDefault()
    // console.log(company)
    // console.log(location)
    // console.log(jobType)
    // console.log(employmentTerm)
    // console.log(salaryMin)
    // console.log(salaryMax)
    // console.log(salaryType)
    // console.log(listingType)
    // console.log(remote)
    //constraints on salary input, make sure the data sent to backend is valid
    if(salaryMax < 0 || salaryMin < 0){
      alert("salary cannot be negative!")
      return;
    }
    if(salaryMax < salaryMin){
      alert("maximum salary must be equal or greater than minimum salary!")
      return;
    }

    try {const config = {
                headers: {
                    'Content-type': 'application/json'
                }
            }
            const { data } = await axios.get(`http://insightwearai.sytes.net:8000/api/search/`, 
            {params:{
              'searchValue': name, 
            'company': company,
            'location': location, 
            'jobType': jobType,
            'employmentTerm': employmentTerm, 
            'salaryMin': salaryMin,
            'salaryMax': salaryMax,
            'salaryType': salaryType, 
            'listingType': listingType,
            'remote': remote}}, 
            config)
            // console.log(data)
            // console.log('filter success')
            //set the job arrays with new returned value
            setSearchPeople(data.users);
            setSearchJob(data.jobs);
            setUseFilter(true)
            setCompany('');
            setJobType('');
            setSalaryMin(0);
            setSalaryMax(99999999);
            setSalaryType('');
            setLocation('');
            setEmploymentTerm('');
            setListingType('');
            setRemote('');
          }catch(error){
            console.log(error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message)
        }
        setFilterForm(false) 
}

// save the search filter values as a Job alert
const saveSearch = () => {
  if(salaryMax < 0 || salaryMin < 0){
    alert("salary cannot be negative!")
    return;
  }
  if(salaryMax < salaryMin){
    alert("maximum salary must be equal or greater than minimum salary!")
    return;
  }
  
  dispatch(create_job_alert(userInfo.id, name, company, location, jobType, employmentTerm, salaryMin, salaryMax, salaryType, listingType, remote))
}

//show the filter form
const enterFilter = (e) => {
  e.preventDefault()
  setFilterForm(true)
}

//hide the filter form
const quitFilter = (e) => {
    e.preventDefault()
    setFilterForm(false)
}

// console.log(searchPeople);
// console.log(searchJob);
// console.log(searchPeople.length)

  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <div>
            <div>
              {name?
              <>
              {jobMode?<>
              <Button onClick={enterFilter}>Add Filter for Job Search</Button>
              <hr></hr>
              </>:<></>}
              </>
              :<></>}
              {filterForm?
              
              //the filter form, only be displayed when the user clicks on the filter button            
              <Form>
              <Row>  
                <Col>
                <FormGroup className='mb-4'>
                <Label className='labelE' for="company" >Company</Label>
                <Input  name="company" id="company" placeholder="enter company name"
                onChange={(e)=> setCompany(e.target.value)}/>
                </FormGroup>
                </Col>
                <Col>
                <FormGroup className='mb-4'>
                <Label className='labelE' for="Location">Location</Label>
                    <Input  className= 'form-control' 
                    name="Location" id="Location" placeholder="enter location"
                    onChange={(e)=> setLocation(e.target.value)}/>
                </FormGroup>
                </Col>
              </Row>

              <FormGroup className='mb-4'>
                 <Row> 
                  <Col> 
                <Label className='labelE' for="Job Type">Job Type</Label>
                    <Input  name="Job Type" id="Job Type" type='select'
                    onChange={(e)=> setJobType(e.target.value)}>
                    <option key={"select an option"} value={""}>select an option</option>
                       <option key={"FULLTIME"} value={"FULLTIME"}>Full Time</option>
                       <option key={"PARTTIME"} value={"PARTTIME"}>Part Time</option>
                       <option key={"INTERNSHIP"} value={"INTERNSHIP"}>Internship</option>
                       <option key={"FREELANCE"} value={"FREELANCE"}>Freelance</option>
                    </Input>
                  </Col>  
                  <Col> 
                <Label className='labelE' for="Employment Term">Employment Term</Label>
                    <Input  name="Employment Term" id="Employment Term" type='select'
                    onChange={(e)=> setEmploymentTerm(e.target.value)}>
                     <option key={"select an option"} value={""}>select an option</option>
                       <option key={"PERMANENT"} value={"PERMANENT"}>Permanent</option>
                       <option key={"TEMPORARY"} value={"TEMPORARY"}>Temporary</option>
                       <option key={"CONTRACT"} value={"CONTRACT"}>Contract</option>
                       <option key={"CASUAL"} value={"CASUAL"}>Casual</option>
                    </Input>
                  </Col>  
                </Row>
              </FormGroup>  
                
                <FormGroup className='mb-4'>  
                <Row>
                <Col>
                <Label className='labelE' for="SalaryMin">Minimum Salary</Label>
                    <Input  type="number" name="SalaryMin" value={salaryMin} id="SalaryMin" placeholder="Enter Salary"
                    onChange={(e)=> setSalaryMin(e.target.value)}/>                    
                </Col>
                <Col>
                <Label className='labelE' for="SalaryMax">Maximum Salary</Label>
                    <Input  type="number" name="SalaryMax" value={salaryMax} id="SalaryMax" placeholder="Enter Salary"
                    onChange={(e)=> setSalaryMax(e.target.value)}/>
                </Col>   
                <Col>
                <Label className='labelE' for="SalaryType">Salary Type</Label>
                    <Input  type="select" name="SalaryType" value={salaryType} id="SalaryType" 
                    onChange={(e)=> setSalaryType(e.target.value)}>
                      <option key={"select an option"} value={""}>select an option</option>
                       <option key={"ANNUALLY"} value={"ANNUALLY"}>Annually</option>
                       <option key={"HOURLY"} value={"HOURLY"}>Hourly</option>
                       <option key={"FLATRATE"} value={"FLATRATE"}>Flat rate</option>
                    </Input>
                </Col>   
                </Row>
                </FormGroup>
                
                <FormGroup className='mb-4'>
                 <Row> 
                  <Col> 
                <Label className='labelE' for="Listing Type">External?</Label>
                    <Input  name="Listing Type" id="Listing Type" type='select'
                    onChange={(e)=> setListingType(e.target.value)}>
                    <option key={"select an option"} value={""}>select an option</option>
                       <option key={'EXTERNAL'} value={'EXTERNAL'}>Yes</option>
                       <option key={'INTERNAL'} value={'INTERNAL'}>No</option>
                    </Input>
                  </Col>  
                  <Col> 
                <Label className='labelE' for="Remote">Remote?</Label>
                    <Input  name="Remote" id="Remote" type='select'
                    onChange={(e)=> setRemote(e.target.value)}>
                    <option key={"select an option"} value={""}>select an option</option>
                       <option key={'true'} value={true}>Yes</option>
                       <option key={'false'} value={false}>No</option>  
                    </Input>
                  </Col>  
                </Row>
              </FormGroup>  

                <Row className='editButtonContainer'>
                <Col xs={12} md={4}>
                    <Button type = 'submit' className='editSaveButton' onClick={applyFilter}> Apply Filter</Button>
                </Col>
                
                <Col xs={12} md={4}>
                    <Button type = 'submit' className='editSaveButton' onClick={() => saveSearch()}> Save Search </Button>
                </Col>
                <Col xs={12} md={4}>
                    <Button className='editCancelButton' onClick={quitFilter}>Cancel</Button>
                </Col>
            </Row>
              </Form>
              :<></>}
              
            </div>
           
            {jobMode?<>
             {useFilter?<>
            <h1> Filtered Job Search Results for '{name}'</h1> 
            </>
                :<> <h1> job Search Results for '{name}'</h1>  
                </>}
            </>
              
              
              :<><h1> User Search Results for '{name}'</h1> 
              </>}
            
                
           
        
        <div className="profile-card">
            <Tabs style={{paddingTop:"1rem"}}
             defaultActiveKey="People"
             id="recievedRecommendations"
              className="mb-3"
              onSelect={(e) => handleClick(e)}>

              {/* searched users   */}
             <Tab eventKey="People" title="People" >
               <Container>
                <h2>Names</h2>
                {(searchPeople.length > 0) ? 
                 <>
                 {searchPeople.map(users => (
                <ProfileCard key={users.id} user={users}/>
              ))
              } 
                </>
                : <p>No results for users</p>}
                </Container>
             </Tab>

              {/* searched job */}
             <Tab eventKey="Jobs" title="Jobs">
              
             <Container>
                <h2>Job Title</h2>
                {(searchJob.length > 0) ? 
                 <>
                 {searchJob.map(jobs => (
                <JobCard key={jobs.id} job={jobs}/>
              ))
              }    
                </>
                : <>
                {useFilter?<><p>No matching jobs for the current filter </p>
                </>
                :<><p>No results for jobs</p>
                </>}
                
                </>
                }
                 
                
                 
                </Container>
             </Tab>
             </Tabs>             
             </div>

            
           
            
        </div>
        ) : (        
        <Row>
          
          <Alert  className='alertLogin' key='primary' variant='primary'>
              <h5>You are not signed in! Please <a href="/login">Sign in</a> or <a href="/register">Register</a>!</h5>
              
          </Alert>

        </Row>)}
      </Container>
  )

}
export default SearchScreen;
