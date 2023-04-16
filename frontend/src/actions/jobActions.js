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

    CREATE_JOB_ALERT_REQUEST,
    CREATE_JOB_ALERT_SUCCESS,
    CREATE_JOB_ALERT_FAIL,

    CREATE_JOB_APPLICATION_REQUEST,
    CREATE_JOB_APPLICATION_SUCCESS,
    CREATE_JOB_APPLICATION_FAIL,

    REMOVE_JOB_APPLICATION_REVIEW_REQUEST,
    REMOVE_JOB_APPLICATION_REVIEW_SUCCESS,
    REMOVE_JOB_APPLICATION_REVIEW_FAIL,

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
 * @param image is an image associated with the Job Listing.
 * @param location is the city where the job opportunity is located.
 * @param deadline is the last date that applications will be accepted for the Job Listing.
 * @param requiredDocs is a list of documents that are required to apply for the job.
 * @param salary is the salary associated with the Job Listing.
 * @param salary_type is the type of salary associated with the Job Listing (hourly or annually).
 * @param listing_type is a choice value describing if the Job Listing is an Internal or External listing.
 * @param link is the link to apply to the external job listing.
 * @param employment_term specifies the employment term of position that is available (permanent, contract, etc.).
 * @param job_type specifies the type of position that is available (full-time, part-time, etc.).
 * @returns the success value of the request and a message providing details.
 * @throws error if there is an error while attempting to create the Job Listing.
 */
export const create_job = (author, email, title, description, remote, active, company, image, location, deadline, requiredDocs, salary, salary_type, listing_type, link, employment_term, job_type) => async (dispatch, getState) => {
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
            { 'author': author, 
            'title': title, 
            'description': description, 
            'remote': remote,
            'status': active,
            'company': company,
            'location': location, 
            'image': image, 
            'deadline': deadline, 
            'required_docs': requiredDocs, 
            'salary': salary,
            'salary_type': salary_type,
            'listing_type': listing_type, 
            'link': link,
            'employment_term': employment_term,
            'job_type': job_type 
            },
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
 * @param image is an image associated with the Job Listing.
 * @param location is the city where the job opportunity is located.
 * @param deadline is the last date that applications will be accepted for the Job Listing.
 * @param requiredDocs is a list of documents that are required to apply for the job.
 * @param salary is the salary associated with the Job Listing.
 * @param salary_type is the type of salary associated with the Job Listing (hourly or annually).
 * @param listing_type is a choice value describing if the Job Listing is an Internal or External listing.
 * @param link is the link to apply to the external job listing.
 * @param employment_term specifies the employment term of position that is available (permanent, contract, etc.).
 * @param job_type specifies the type of position that is available (full-time, part-time, etc.).
 * @returns the success value of the request and a message providing details.
 * @throws error if there is an error while attempting to update the Job Listing.
 */
export const update_job = (jobID, author, title, description, remote, active, company, image, location, deadline, required_docs, salary, salary_type, listing_type, link, employment_term, job_type) => async (dispatch, getState) => {
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
        'location': location,
        'deadline': deadline,
        'required_docs': required_docs,
        'salary': salary,
        'salary_type': salary_type,
        'listing_type': listing_type,
        'link': link,
        'employment_term': employment_term,
        'job_type': job_type
        }, 
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

/**
 * A function that sends a request to create a new Job Alert for a specific user in the database.
 * @param userId is the ID of the user who is creating the Job Alert.
 * @param search_value is the keyword that is being searched by the user.
 * @param company is the company that the user is searching for job opportunities from.
 * @param location is the city where the user wants the job opportunity to be located.
 * @param job_type specifies the type of position that is available (full-time, part-time, etc.).
 * @param employment_term specifies the employment term of the position that the user wants to find (permanent, contract, etc.).
 * @param salary_min is the minimum salary that the user wants to find.
 * @param salary_max is the maximum salary that the user wants to find.
 * @param salary_type is the type of salary associated with the job that the user wants (hourly or annually).
 * @param listing_type is a choice value describing if the Job Listing is an Internal or External listing.
 * @param remote is the boolean value describing if the user wants to find a remote opportunity.
 * @returns the success value of the request and a message providing details.
 * @throws error if there is an error while attempting to create the Job Listing.
 */
export const create_job_alert = (userId, search_value, company, location, job_type, employment_term, salary_min, salary_max, salary_type, listing_type, remote) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CREATE_JOB_ALERT_REQUEST
        })
          
        const { 
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'multipart/form-data', 
            } 
        }

        const { data } = await axios.post(
            `http://localhost:8000/api/job_alerts/${userId}/create/`,
            {'search_value': search_value, 
            'company': company,
            'location': location, 
            'job_type': job_type,
            'employment_term': employment_term, 
            'salary_min': salary_min,
            'salary_max': salary_max,
            'salary_type': salary_type, 
            'listing_type': listing_type,
            'remote': remote},
            config
        )
        
        dispatch({
            type: CREATE_JOB_ALERT_SUCCESS,
            payload: data
        })
        return { success: true, message: "Job Alert successfully created." };
    } catch (error) {
        dispatch({
            type: CREATE_JOB_ALERT_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
        return { success: false, message: "There was an error while creating the Job Alert." };
    }
}


/**

Creates a job application and submits it to the server.
@param {Number} job_id - The id corresponding to the Job that the application is for.
@param {string} email - The email of the applicant.
@param {string} name - The name of the applicant.
@param {string} telephone - The telephone number of the applicant.
@param {string} city - The city of the applicant.
@param {string} provinceState - The province/state of the applicant.
@param {string} country - The country of the applicant.
@param {string} experience - The work experience of the applicant.
@param {string} work - The current work of the applicant.
@param {string} education - The education of the applicant.
@param {string} volunteering - The volunteering experience of the applicant.
@param {string} courses - The courses of the applicant.
@param {string} projects - The projects of the applicant.
@param {string} awards - The awards of the applicant.
@param {string} languages - The languages the applicant is proficient in.
@param {string} resume - The resume file of the applicant.
@param {string} coverLetter - The cover letter file of the applicant.
@param {string} recommendationLetter - The recommendation letter file of the applicant.
@param {string} portfolio - The portfolio file of the applicant.
@param {string} transcript - The transcript file of the applicant.
@param {string} otherDocuments - Any other documents related to the job application.
@param {string} profile - The profile of the applicant.
@returns {Object} Returns an object with a success flag and a message indicating whether the job application was submitted successfully or not.
*/
export const create_job_application = (user_id, job_id, email, name, telephone, city, provinceState, country, experience, work, education, volunteering, courses, projects, awards, languages, resume, coverLetter, recommendationLetter, portfolio, transcript, otherDocuments, profile) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CREATE_JOB_APPLICATION_REQUEST
        })
          
        const { 
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'multipart/form-data', 
            } 
        }

        const { data } = await axios.post(
            `http://localhost:8000/api/job/apply/`,
            {   
                'user_id': user_id,
                'job_id': job_id,
                'email': email, 
                'name': name, 
                'telephone': telephone, 
                'city': city, 
                'provinceState': provinceState, 
                'country': country, 
                'experience': experience, 
                'work': work, 
                'education': education, 
                'volunteering': volunteering, 
                'courses': courses, 
                'projects': projects, 
                'awards': awards, 
                'languages': languages, 
                'resume': resume, 
                'coverLetter': coverLetter, 
                'recommendationLetter': recommendationLetter, 
                'portfolio': portfolio, 
                'transcript': transcript, 
                'otherDocuments': otherDocuments, 
                'profile': profile
            },
            config
        )
        
        dispatch({
            type: CREATE_JOB_APPLICATION_SUCCESS,
            payload: data
        })
        return { success: true, message: "Job Application submitted successfully!" };
    } catch (error) {
        dispatch({
            type: CREATE_JOB_APPLICATION_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
        return { success: false, message: "There was an error while submitting your job application. Please try again." };
    }
}


export const remove_job_application_review = (uId, jobId) => async (dispatch) => {
    try {
        dispatch({
            type: REMOVE_JOB_APPLICATION_REVIEW_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }
        
        // Send a DELETE request to remove the job application request
        const { data } = await axios.delete(
            `http://localhost:8000/api/jobRequest/delete/`,
            {'userId': uId, 
            'jobId': jobId, 
            }, 
            config
        )
        
        // If the request is successful, dispatch an action with the deleted job request
        dispatch({
            type: REMOVE_JOB_APPLICATION_REVIEW_SUCCESS,
            payload: data
        })
    } catch (error) {
        // If the request fails, dispatch an action with the error message
        dispatch({
            type: REMOVE_JOB_APPLICATION_REVIEW_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}