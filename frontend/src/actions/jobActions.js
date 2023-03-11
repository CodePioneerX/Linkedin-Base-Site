import axios from "axios";

import{
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

export const create_job = (author, email, title, description,remote, active, company,job_type, image,salary,location)  => async (dispatch, getState) => {
    try {
        
        dispatch({
            type: CREATE_JOB_REQUEST
        })
          
        const { 
            userLogin: { userInfo },
        } = getState()

      
        const config = {
            headers: {
                'Content-type': 'multipart/form-data', 
                // Authorization: `Bearer ${userInfo.token}`
            } 
        }
        
        console.log('config: ', config)
        console.log('remote: ', remote)
        console.log('active: ', active)

        const { data } = await axios.post(
            'http://localhost:8000/api/create_job/',
            { 'author': author, 'title': title, 'description': description, 'remote':remote ,'status':active ,'company':company ,'job_type':job_type ,'salary':salary ,'location':location, 'image':image },
            config
        )
        
        dispatch({
            type: CREATE_JOB_SUCCESS,
            payload: data
        })

    } catch (error) {
        console.log("creating a job failed")
        dispatch({
            
            type: CREATE_JOB_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const update_job = (jobID, author, title, description, remote, active, company, job_type, image, salary, location) => async (dispatch, getState) => {
    try {
        dispatch({
            type: UPDATE_JOB_REQUEST
        })

        const {
            userLogin: {userInfo},
        } = getState()

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }

        console.log('remote: ', remote)
        console.log('active: ', active)
        
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
        'location': location }, 
        config)

        dispatch({
            type: UPDATE_JOB_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log('updating job failed')
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

        const { data } = await axios.delete(
            `http://localhost:8000/api/job/delete/` + id,
            config
        )
        
        dispatch({
            type: DELETE_JOB_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: DELETE_JOB_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
