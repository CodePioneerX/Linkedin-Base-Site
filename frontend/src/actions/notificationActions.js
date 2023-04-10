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

/** 
 * A function that sends a request to retrieve a specific user's Notifications.
 * @param id is the ID of the user whose Notifications need to be fetched.
 * @returns the success value of the request and the user's Notifications.
 * @throws error if there is an error while attempting to retrieve the user's Notifications. 
 */ 
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

/** 
 * A functions that checks if a user has received new Notifications since the last check time.
 * @param id is the ID of the user whose Notifications are being checked.
 * @param datetime is a datetime string representing the last time that the user's Notifications were checked. 
 * @returns the success value of the request and a boolean value representing if the user has new Notifications.
 * @throws error if there is an error while attempting to check the user's Notifications. 
 */ 
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

/** 
 * A function that sends a request to retrieve the count of a specific user's unread Notifications.
 * @param id is the ID of the user whose notifications need to be fetched.
 * @returns the success value of the request and the user's unread Notification count.
 * @throws error if there is an error while attempting to retrieve the user's unread Notification count. 
 */ 
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

/** 
 * A function that sends a request to delete a specific Notification.
 * @param id is the ID of the Notification that should be deleted.
 * @returns the success value of the request and a message stating if the Notification was deleted.
 * @throws error if there is an error while attempting to delete the Notification. 
 */ 
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

/** 
 * A function that sends a request to clear (delete) all of a specific user's Notifications.
 * @param id is the ID of the user whose Notifications need to be cleared.
 * @returns the success value of the request and a message stating if the Notifications were cleared.
 * @throws error if there is an error while attempting to clear the Notifications. 
 */ 
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

/** 
 * A function that sends a request to toggle a specific Notification's unread value.
 * @param id is the ID of the Notification that should be updated.
 * @returns the success value of the request and a message stating if the Notification was updated.
 * @throws error if there is an error while attempting to update the Notification. 
 */ 
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

/** 
 * A function that sends a request to mark all of a specific user's Notifications as read.
 * @param id is the ID of the user whose Notifications should be updated.
 * @returns the success value of the request and a message stating if the Notifications were updated.
 * @throws error if there is an error while attempting to update the Notifications. 
 */ 
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
