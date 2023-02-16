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

    GET_POSTS_REQUEST,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,

    CREATE_JOB_REQUEST,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_FAIL,

    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAIL,
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

// export const loadProfile = ()

// note: dispatch({ type: USER_LOGOUT }) causing infinite error loop - investigate 
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    // dispatch({ type: USER_LOGOUT })
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
        console.log("login failed")
        dispatch({
            
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

// Name should be GET PROFILE not POSTS
export const getPosts = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_POSTS_REQUEST
        })
        
        const { 
            userLogin: { userInfo },
        } = getState()

      
        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(
            `http://localhost:8000/api/profile/${id}`, 
            config
        )

        dispatch({
            type: GET_POSTS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_POSTS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const create_job = (author, email,title, description,remote, active, company,job_type, image,salary,location)  => async (dispatch, getState) => {
    try {
        
        dispatch({
            type: CREATE_JOB_REQUEST
        })
        
        // const config = {
        //     headers: {
        //         'Content-type': 'multipart/form-data'
        //     }
        // }
          
        const { 
            userLogin: { userInfo },
        } = getState()

      
        const config = {
            headers: {
                'Content-type': 'multipart/form-data',
                Authorization: `Bearer ${userInfo.token}`
            } 
        }
        
        console.log('config: ', config)

        const { data } = await axios.post(
            'http://localhost:8000/api/create_job/',
            { 'author': email, 'title': title, 'description': description, 'remote':true ,'status':'active' ,'company':company ,'job_type':job_type ,'salary':salary ,'location':location, 'image':image },
            config
        )
        
        dispatch({
            type: CREATE_JOB_SUCCESS,
            payload: data
        })
        //localStorage.setItem('userInfo', JSON.stringify(data))
        // dispatch(login(email, password))

        // dispatch({
        //     type: USER_LOGIN_SUCCESS,
        //     payload: data
        // })

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