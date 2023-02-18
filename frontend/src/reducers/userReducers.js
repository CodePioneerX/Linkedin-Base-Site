import {USER_LOGIN_REQUEST,
        USER_LOGIN_SUCCESS,
        USER_LOGIN_FAIL,
        USER_LOGOUT, 

        USER_REGISTER_REQUEST, 
        USER_REGISTER_SUCCESS, 
        USER_REGISTER_FAIL,
    
        GET_PROFILE_REQUEST,
        GET_PROFILE_SUCCESS,
        GET_PROFILE_FAIL
} from '../constants/userConstants'

    export const userLoginReducer = (state = {}, action) => {
        switch (action.type) {
            case USER_LOGIN_REQUEST:
                return { loading: true }
    
            case USER_LOGIN_SUCCESS:
                return { loading: false, userInfo: action.payload }
    
            case USER_LOGIN_FAIL:
                return { loading: false, error: action.payload }
    
            case USER_LOGOUT:
                return {}
    
            default:
                return state
        }
    }

    export const userRegisterReducer = (state = {}, action) => {
        switch (action.type) {
            case USER_REGISTER_REQUEST:
                return { loading: true }
    
            case USER_REGISTER_SUCCESS:
                return { loading: false, userInfo: action.payload }
    
            case USER_REGISTER_FAIL:
                return { loading: false, error: action.payload }
    
            case USER_LOGOUT:
                return {}
    
            default:
                return state
        }
    }

    export const userProfileReducer = (state = {}, action) => {
        switch (action.type) {
            case GET_PROFILE_REQUEST:
                return { ...state, loading: true }
    
            case GET_PROFILE_SUCCESS:
                return { loading: false, profile: action.payload }
    
            case GET_PROFILE_FAIL:
                return { loading: false, error: action.payload }
    
            default:
                return state
        }
    }
