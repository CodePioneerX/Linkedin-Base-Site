import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';

import Alert from 'react-bootstrap/Alert';

function SearchScreen() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { name } = useParams();
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    if (name) {
<<<<<<< Updated upstream
        axios.get('http://insightwearai.sytes.net:8000/api/search-profile/'+name)
=======
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
>>>>>>> Stashed changes
        .then(response => {
            setSearchResults(response.data);
        }
        )
        .catch(error => {
            console.log('error:',error);
        }
        )
    }
  }, [name]);

<<<<<<< Updated upstream
=======

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
>>>>>>> Stashed changes
  


  return (
      <Container className="justify-content-md-center padd">
        {userInfo ? (
          <div>
            <h1>Search Results for {name}</h1>
            <Container>
              {searchResults && searchResults.map((user) => (
                <Row>
                 
                  <ProfileCard name={user.name} title={user.title} about={user.about} image={user.image} />
                </Row>
                
              ))}
            </Container>
            
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
