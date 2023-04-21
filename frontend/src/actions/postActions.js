import axios from "axios";

import{
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAIL,

    UPDATE_POST_REQUEST,
    UPDATE_POST_SUCCESS,
    UPDATE_POST_FAIL,

    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    DELETE_POST_FAIL,

    GET_POSTS_REQUEST,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,
} from '../constants/postConstants'

// Action creator for creating a post
export const create_post = (author, title, content, image)  => async (dispatch, getState) => {
    try {
        
        // Dispatch a CREATE_POST_REQUEST action
        dispatch({
            type: CREATE_POST_REQUEST
        })
        
        // Get the user information from the state
        const { 
            userLogin: { userInfo },
        } = getState()

        // Set the headers for the POST request
        const config = {
            headers: {
                'Content-type': 'multipart/form-data',
                //Authorization: `Bearer ${userInfo.token}`
            } 
        }
        
        // Make the POST request to the API endpoint
        const { data } = await axios.post(
            'http://localhost:8000/api/create_post/',
            { 'author': author, 'title': title, 'content': content, 'image':image },
            config
        )
        
        // Dispatch a CREATE_POST_SUCCESS action with the returned data from the API endpoint
        dispatch({
            type: CREATE_POST_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        // If there's an error, dispatch a CREATE_POST_FAIL action with the error message
        console.log("creating a POST failed")
        dispatch({
            
            type: CREATE_POST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

// Action creator for updating a post
export const update_post = (postID, title, content, image) => async (dispatch, getState) => {
    try {
        // Dispatch an UPDATE_POST_REQUEST action
        dispatch({
            type: UPDATE_POST_REQUEST
        })
        
        // Get the user information from the state
        const {
            userLogin: {userInfo},
        } = getState()
        
        // Set the headers for the PUT request
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        
         // Make the PUT request to the API endpoint with the updated post information
        const { data } = await axios.put(`http://localhost:8000/api/post/update/` + postID, 
        {'title': title, 'content': content, 'image': image}, 
        config)
        
         // Dispatch an UPDATE_POST_SUCCESS action with the returned data from the API endpoint
        dispatch({
            type: UPDATE_POST_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        // If there's an error, dispatch an UPDATE_POST_FAIL action with the error message
        console.log('updating post failed')
        dispatch({
            type: UPDATE_POST_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}

// Action creator for deleting a post
export const delete_post = (id) => async (dispatch, getState) => {
    try {
        // Dispatch a DELETE_POST_REQUEST action
        dispatch({
            type: DELETE_POST_REQUEST
        })
    
        // Get the user information from the state
        const {
            userLogin: {userInfo},
        } = getState()
        
        // Set the headers for the DELETE request
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
