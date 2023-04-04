import axios from "axios"

import{
    GET_NOTIFICATION_REQUEST,
    GET_NOTIFICATION_SUCCESS,
    GET_NOTIFICATION_FAIL,
    
    GET_NOTIFICATIONS_REQUEST,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,

    CHECK_NEW_NOTIFICATIONS_REQUEST,
    CHECK_NEW_NOTIFICATIONS_SUCCESS,
    CHECK_NEW_NOTIFICATIONS_FAIL,

    COUNT_UNREAD_NOTIFICATIONS_REQUEST,
    COUNT_UNREAD_NOTIFICATIONS_SUCCESS,
    COUNT_UNREAD_NOTIFICATIONS_FAIL,
    
    CREATE_NOTIFICATION_REQUEST,
    CREATE_NOTIFICATION_SUCCESS,
    CREATE_NOTIFICATION_FAIL,

    UPDATE_NOTIFICATION_REQUEST,
    UPDATE_NOTIFICATION_SUCCESS,
    UPDATE_NOTIFICATION_FAIL,

    UPDATE_ALL_NOTIFICATIONS_REQUEST,
    UPDATE_ALL_NOTIFICATIONS_SUCCESS,
    UPDATE_ALL_NOTIFICATIONS_FAIL,
    
    DELETE_NOTIFICATION_REQUEST,
    DELETE_NOTIFICATION_SUCCESS,
    DELETE_NOTIFICATION_FAIL,
    
    CLEAR_NOTIFICATIONS_REQUEST,
    CLEAR_NOTIFICATIONS_SUCCESS,
    CLEAR_NOTIFICATIONS_FAIL,
} from '../constants/notificationConstants'
 
export const get_notifications = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_NOTIFICATIONS_REQUEST,
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/notifications/user/${id}`, config)
        
        dispatch({
            type: GET_NOTIFICATIONS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message

        dispatch({
            type: GET_NOTIFICATIONS_FAIL,
            payload: message
        })
    }
}

export const check_new_notifications = (id, datetime) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHECK_NEW_NOTIFICATIONS_REQUEST,
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/notifications/new/user/${id}`, 
            {params : {'datetime' : datetime}}, 
            config)
        
        dispatch({
            type: CHECK_NEW_NOTIFICATIONS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message

        dispatch({
            type: CHECK_NEW_NOTIFICATIONS_FAIL,
            payload: message
        })
    }
}

export const count_notifications = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COUNT_UNREAD_NOTIFICATIONS_REQUEST,
        })
        
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        }

        const { data } = await axios.get(`http://localhost:8000/api/notifications/unread/user/${id}`, config)
        
        dispatch({
            type: COUNT_UNREAD_NOTIFICATIONS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message

        dispatch({
            type: COUNT_UNREAD_NOTIFICATIONS_FAIL,
            payload: message
        })
    }
}

export const delete_notification = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: DELETE_NOTIFICATION_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }
        
        const { data } = await axios.delete(
            `http://localhost:8000/api/notification/delete/${id}`,
            config
        )
        
        dispatch({
            type: DELETE_NOTIFICATION_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: DELETE_NOTIFICATION_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const clear_notifications = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CLEAR_NOTIFICATIONS_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        const { data } = await axios.delete(
            `http://localhost:8000/api/notifications/user/clear/${id}`,
            config
        )

        dispatch({
            type: CLEAR_NOTIFICATIONS_SUCCESS,
            payload: data
        })
    } catch(error) {
        dispatch({
            type: CLEAR_NOTIFICATIONS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const read_notification = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: UPDATE_NOTIFICATION_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }
        
        const { data } = await axios.put(
            `http://localhost:8000/api/notification/read/${id}`,
            config
        )
        
        dispatch({
            type: UPDATE_NOTIFICATION_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: UPDATE_NOTIFICATION_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const read_all_notifications = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: UPDATE_ALL_NOTIFICATIONS_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        const { data } = await axios.put(
            `http://localhost:8000/api/notifications/user/read_all/${id}`,
            config
        )

        dispatch({
            type: UPDATE_ALL_NOTIFICATIONS_SUCCESS,
            payload: data
        })
    } catch(error) {
        dispatch({
            type: UPDATE_ALL_NOTIFICATIONS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }

}
