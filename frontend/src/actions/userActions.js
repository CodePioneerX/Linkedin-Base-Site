import axios from "axios";

import{
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,

    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAIL,

    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,

    GET_POSTS_REQUEST,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,

    CREATE_JOB_REQUEST,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_FAIL,

    UPDATE_JOB_REQUEST,
    UPDATE_JOB_SUCCESS,
    UPDATE_JOB_FAIL,
    
    DELETE_JOB_REQUEST,
    DELETE_JOB_SUCCESS,
    DELETE_JOB_FAIL,

    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAIL,

    UPDATE_POST_REQUEST,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAIL,

    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL,
} from '../constants/userConstants'

export const getProfileDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        })
        
        const { 
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(
            `http://localhost:8000/api/profile/${id}`, 
            config
        )

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const login = (email,password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(
            'http://localhost:8000/api/login/',
            { 'username': email, 'password': password },
            config
        )
        console.log(data)
        
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })
        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        
        const { data } = await axios.post(
            'http://localhost:8000/api/register/',
            { 'name': name, 'username': email, 'password': password },
            config
        )
        
        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        //localStorage.setItem('userInfo', JSON.stringify(data))
        // dispatch(login(email, password))

        // dispatch({
        //     type: USER_LOGIN_SUCCESS,
        //     payload: data
        // })

    } catch (error) {
        console.log("register failed")
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const get_profile = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_PROFILE_REQUEST
        })
        
        const { 
            userLogin: { userInfo },
        } = getState()

      
        const config = {
            headers: {
                // 'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(
            `http://localhost:8000/api/profile/` + id, 
            config
        )

        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

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

        const { data } = await axios.post(
            'http://localhost:8000/api/create_job/',
            { 'author': author, 'title': title, 'description': description, 'remote':true ,'status':'active' ,'company':company ,'job_type':job_type ,'salary':salary ,'location':location, 'image':image },
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

export const create_post = (author, title, content, image)  => async (dispatch, getState) => {
    try {
        
        dispatch({
            type: CREATE_POST_REQUEST
        })
        
        const { 
            userLogin: { userInfo },
        } = getState()

      
        const config = {
            headers: {
                'Content-type': 'multipart/form-data',
                //Authorization: `Bearer ${userInfo.token}`
            } 
        }
        
        console.log('config: ', config)

        const { data } = await axios.post(
            'http://localhost:8000/api/create_post/',
            { 'author': author, 'title': title, 'content': content, 'image':image },
            config
        )
        
        dispatch({
            type: CREATE_POST_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log("creating a POST failed")
        dispatch({
            
            type: CREATE_POST_FAIL,
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

export const update_post = (postID, title, content) => async (dispatch, getState) => {
    try {
        dispatch({
            type: UPDATE_POST_REQUEST
        })

        const {
            userLogin: {userInfo},
        } = getState()

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        const { data } = await axios.put(`http://localhost:8000/api/post/update/` + postID, {'title': title, 'content': content}, config)

        dispatch({
            type: UPDATE_POST_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log('updating post failed')
        dispatch({
            type: UPDATE_POST_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}

export const delete_post = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DELETE_POST_REQUEST
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
            `http://localhost:8000/api/post/delete/` + id,
            config
        )
        
        dispatch({
            type: DELETE_POST_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: DELETE_POST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const update_profile = (uID, name, title, city, about, experience, education, image, work, volunteering, courses, projects, awards, languages) => async (dispatch, getState) => {
    try {
        dispatch({
            type: UPDATE_PROFILE_REQUEST
        })

        const {
            userLogin: {userInfo},
        } = getState()

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        const { data } = await axios.put(`http://localhost:8000/api/profile/update/` + uID, 
            {'name': name, 
            'title': title, 
            'city': city, 
            'about': about,
            'experience': experience,
            'education': education, 
            'work': work, 
            'volunteering': volunteering,
            'courses': courses, 
            'projects': projects, 
            'awards': awards, 
            'languages': languages}, 
            config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log('updating post failed')
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}
