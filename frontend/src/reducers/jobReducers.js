import{
    CREATE_JOB_ALERT_REQUEST,
    CREATE_JOB_ALERT_SUCCESS,
    CREATE_JOB_ALERT_FAIL
} from '../constants/jobConstants'

export const createJobAlertReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_JOB_ALERT_REQUEST:
            return { loading: true }

        case CREATE_JOB_ALERT_SUCCESS:
            return { loading: false, jobAlert: action.payload }

        case CREATE_JOB_ALERT_FAIL:
            return { loading: false, error: action.payload }
            
        default:
            return state
    }
}
