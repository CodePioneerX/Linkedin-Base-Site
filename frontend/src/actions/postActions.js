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
