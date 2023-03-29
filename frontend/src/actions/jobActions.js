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

/**
 * A function that sends a request to create a new Job Listing in the database.
 * @param author is the ID of the user who is creating the Job Listing.
 * @param email is the email of the user who is creating the Job Listing.
 * @param title is the title of the Job Listing.
 * @param description is the description of the Job Listing.
 * @param remote is the boolean value describing if the Job Listing is a remote opportunity.
 * @param active is the boolean value describing if the Job Listing is still active.
 * @param company is the company who is offering the job opportunity.
 * @param job_type is the name of the type of position that is available.
 * @param image is an image associated with the Job Listing.
 * @param salary is the salary associated with the Job Listing.
 * @param location is the city where the job opportunity is located.
 * @param deadline is the last date that applications will be accepted for the Job Listing.
 * @param requiredDocs is a list of documents that are required to apply for the job.
 * @returns the success value of the request and a message providing details.
 * @throws error if there is an error while attempting to create the Job Listing.
 */
export const create_job = (author, email, title, description, remote, active, company, job_type, image, salary, location, deadline, requiredDocs) => async (dispatch, getState) => {
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

        // Sending the request to create a job using the axios.post() method and passing the job details along with the configuration object
        const { data } = await axios.post(
            'http://localhost:8000/api/create_job/',
            { 'author': author, 'title': title, 'description': description, 'remote':remote ,'status':active ,'company':company ,'job_type':job_type ,'salary':salary ,'location':location, 'image':image, 'deadline': deadline, 'required_docs': requiredDocs },
            config
        )
        
         // Dispatching the CREATE_JOB_SUCCESS action to inform the state that job creation was successful and passing the job data as payload
        dispatch({
            type: CREATE_JOB_SUCCESS,
            payload: data
        })
        return { success: true, message: "Job Listing successfully created." };
    } catch (error) {
        // If an error occurs while creating a job, then dispatch the CREATE_JOB_FAIL action to update the state with the error message
        console.log("creating a job failed")
        dispatch({
            
            type: CREATE_JOB_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
        return { success: false, message: "There was an error while creating the Job Listing." };
    }
}

/**
 * A function that sends a request to update an existing Job Listing in the database.
 * @param author is the ID of the user who is creating the Job Listing.
 * @param email is the email of the user who is creating the Job Listing.
 * @param title is the title of the Job Listing.
 * @param description is the description of the Job Listing.
 * @param remote is the boolean value describing if the Job Listing is a remote opportunity.
 * @param active is the boolean value describing if the Job Listing is still active.
 * @param company is the company who is offering the job opportunity.
 * @param job_type is the name of the type of position that is available.
 * @param image is an image associated with the Job Listing.
 * @param salary is the salary associated with the Job Listing.
 * @param location is the city where the job opportunity is located.
 * @param deadline is the last date that applications will be accepted for the Job Listing.
 * @param requiredDocs is a list of documents that are required to apply for the job.
 * @returns the success value of the request and a message providing details.
 * @throws error if there is an error while attempting to update the Job Listing.
 */
export const update_job = (jobID, author, title, description, remote, active, company, job_type, image, salary, location, deadline, required_docs) => async (dispatch, getState) => {
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
        const { data } = await axios.put(`http://localhost:8000/api/job/update/` + jobID, 
        { 'author': author, 
        'title': title, 
        'description': description, 
        'remote': remote,
        'status': active,
        'company': company,
        'image': image,
        'job_type': job_type,
        'salary': salary,
        'location': location,
        'deadline': deadline,
        'required_docs': required_docs }, 
        config)

         // If the request is successful, update the state with the new job data
        dispatch({
            type: UPDATE_JOB_SUCCESS,
            payload: data
        })
        return { success: true, message: "Job Listing successfully updated." };
    } catch (error) {
        console.log('updating job failed')
        // If the request fails, dispatch an action with the error message
        dispatch({
            type: UPDATE_JOB_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
        return { success: false, message: "There was an error while updating the Job Listing." };
    }
}

/**
 * A function that sends a request to delete an existing Job Listing in the database.
 * @param id is the ID of the Job Listing that is intended to be deleted.
 * @returns the success value of the request and a message providing details.
 * @throws error if there is an error while attempting to delete the Job Listing.
 */
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
            `http://localhost:8000/api/job/delete/` + id,
            config
        )
        
        // If the request is successful, dispatch an action with the deleted job data
        dispatch({
            type: DELETE_JOB_SUCCESS,
            payload: data
        })
        return { success: true, message: "The Job Listing was successfully deleted." };
    } catch (error) {
        // If the request fails, dispatch an action with the error message
        dispatch({
            type: DELETE_JOB_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
        return { success: false, message: "There was an error while deleting the Job Listing." };
    }
}
