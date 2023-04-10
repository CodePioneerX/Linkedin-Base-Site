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
    
    NOTIFICATION_DETAILS_REQUEST,
    NOTIFICATION_DETAILS_SUCCESS,
    NOTIFICATION_DETAILS_FAIL,

    COUNT_UNREAD_NOTIFICATIONS_REQUEST,
    COUNT_UNREAD_NOTIFICATIONS_SUCCESS,
    COUNT_UNREAD_NOTIFICATIONS_FAIL,
    
    CREATE_NOTIFICATION_REQUEST,
    CREATE_NOTIFICATION_SUCCESS,
    CREATE_NOTIFICATION_FAIL,
    CREATE_NOTIFICATION_RESET,
    
    UPDATE_NOTIFICATION_REQUEST,
    UPDATE_NOTIFICATION_SUCCESS,
    UPDATE_NOTIFICATION_FAIL,
    
    DELETE_NOTIFICATION_REQUEST,
    DELETE_NOTIFICATION_SUCCESS,
    DELETE_NOTIFICATION_FAIL,
    
    CLEAR_NOTIFICATIONS_REQUEST,
    CLEAR_NOTIFICATIONS_SUCCESS,
    CLEAR_NOTIFICATIONS_FAIL,
} from '../constants/notificationConstants'

export const notificationsReducer = (state = { notifications: [] }, action) => {
    switch(action.type) {
        case GET_NOTIFICATIONS_REQUEST:
            return { loading: true }
        
        case GET_NOTIFICATIONS_SUCCESS:
            return { loading: false, notifications: action.payload }

        case GET_NOTIFICATIONS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const notificationsCheckNewReducer = (state = {new_notifications: false}, action) => {
    switch(action.type) {
        case CHECK_NEW_NOTIFICATIONS_REQUEST:
            return { loading: true }
    
        case CHECK_NEW_NOTIFICATIONS_SUCCESS:
            return { loading: false, new_notifications: action.payload }
        
        case CHECK_NEW_NOTIFICATIONS_FAIL:
            return { loading: false, error: action.payload }
        
        default:
            return state
    }
}

export const notificationDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_NOTIFICATION_REQUEST:
            return { loading: true }

        case DELETE_NOTIFICATION_SUCCESS:
            return { loading: false, success: true }

        case DELETE_NOTIFICATION_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const notificationClearReducer = (state = {}, action) => {
    switch (action.type) {
        case CLEAR_NOTIFICATIONS_REQUEST:
            return { loading: true }

        case CLEAR_NOTIFICATIONS_SUCCESS:
            return { loading: false, success: true }

        case CLEAR_NOTIFICATIONS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const notificationReadReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_NOTIFICATION_REQUEST:
            return { loading: true }

        case UPDATE_NOTIFICATION_SUCCESS:
            return { loading: false, success: true }

        case UPDATE_NOTIFICATION_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }   
}

export const notificationCountReducer = (state = {}, action) => {
    switch (action.type) {
        case COUNT_UNREAD_NOTIFICATIONS_REQUEST:
            return { loading: true }

        case COUNT_UNREAD_NOTIFICATIONS_SUCCESS:
            return { loading: false, notif_count: action.payload }

        case COUNT_UNREAD_NOTIFICATIONS_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }   
}
