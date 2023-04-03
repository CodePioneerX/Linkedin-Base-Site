// Importing the required dependencies
import axios from "axios";

import{
    // Importing the constants defined in jobConstants.js file
    CREATE_JOB_REQUEST,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_FAIL,

    UPDATE_JOB_REQUEST,
    UPDATE_JOB_SUCCESS,
    UPDATE_JOB_FAIL,
    
    DELETE_JOB_REQUEST,
    DELETE_JOB_SUCCESS,
    DELETE_JOB_FAIL,
} from '../constants/jobConstants'

// Action to create a new job posting
export const create_job = (author, email, title, description,remote, active, company,job_type, image,salary,location)  => async (dispatch, getState) => {
    try {
        // Dispatching the CREATE_JOB_REQUEST action to inform the state that job creation request has started
        dispatch({
            type: CREATE_JOB_REQUEST
        })
          
        // Get the logged-in user's information from the state
        const { 
            userLogin: { userInfo },
        } = getState()

        // Setting up the configuration for the request
        const config = {
            headers: {
                'Content-type': 'multipart/form-data',
                // Authorization: `Bearer ${userInfo.token}`
            } 
        }
        
        console.log('config: ', config)
        
        // Sending the request to create a job using the axios.post() method and passing the job details along with the configuration object
        const { data } = await axios.post(
            'http://insightwearai.sytes.net:8000/api/create_job/',
            { 'author': author, 'title': title, 'description': description, 'remote':true ,'status':'active' ,'company':company ,'job_type':job_type ,'salary':salary ,'location':location, 'image':image },
            config
        )
        
         // Dispatching the CREATE_JOB_SUCCESS action to inform the state that job creation was successful and passing the job data as payload
        dispatch({
            type: CREATE_JOB_SUCCESS,
            payload: data
        })

    } catch (error) {
        // If an error occurs while creating a job, then dispatch the CREATE_JOB_FAIL action to update the state with the error message
        console.log("creating a job failed")
        dispatch({
            
            type: CREATE_JOB_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

// Action to update an existing job posting
export const update_job = (jobID, author, title, description, remote, active, company, job_type, image, salary, location) => async (dispatch, getState) => {
    try {
        // Dispatching the UPDATE_JOB_REQUEST action to inform the state that job update request has started
        dispatch({
            type: UPDATE_JOB_REQUEST
        })
        
        // Get the logged-in user's information from the state
        const {
            userLogin: {userInfo},
        } = getState()
        
        // Setting up the configuration for the request
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        
        // Sending the request to update a job using the axios.put() method and passing the job details along with the job ID and configuration object
        const { data } = await axios.put(`http://insightwearai.sytes.net:8000/api/job/update/` + jobID, 
        { 'author': author, 
        'title': title, 
        'description': description, 
        'remote': remote,
        'status': active,
        'company': company,
        'image': image,
        'job_type': job_type,
        'salary': salary,
        'location': location }, 
        config)

         // If the request is successful, update the state with the new job data
        dispatch({
            type: UPDATE_JOB_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log('updating job failed')
        // If the request fails, dispatch an action with the error message
        dispatch({
            type: UPDATE_JOB_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}

export const delete_job = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DELETE_JOB_REQUEST
        })

        const {
            userLogin: {userInfo},
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                // Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        // Send a DELETE request to remove the job from the server
        const { data } = await axios.delete(
            `http://insightwearai.sytes.net:8000/api/job/delete/` + id,
            config
        )
        
        // If the request is successful, dispatch an action with the deleted job data
        dispatch({
            type: DELETE_JOB_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        // If the request fails, dispatch an action with the error message
        dispatch({
            type: DELETE_JOB_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
