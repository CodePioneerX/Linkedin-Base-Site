// Import axios for making HTTP requests
import axios from "axios";

// Import all the constants related to recommendations
import{
    SEND_RECOMMEND_REQUEST, 
    SEND_RECOMMEND_SUCCESS,
    SEND_RECOMMEND_FAIL,

    CHECK_RECOMMEND_REQUEST,
    CHECK_RECOMMEND_SUCCESS,
    CHECK_RECOMMEND_FAIL,

    CANCEL_RECOMMEND_REQUEST,
    CANCEL_RECOMMEND_SUCCESS,
    CANCEL_RECOMMEND_FAIL,
} from '../constants/recommendConstants'

export const sendRecommendation = (myUserId, otherUserId,description) => async (dispatch, getState) =>{
    try 
    {
        // Dispatch a recommendation request action
        dispatch({
            type: SEND_RECOMMEND_REQUEST
        })
        
        // Get the user information from the state
        const { 
            userLogin: { userInfo },
        } = getState()
        
        // Set the headers for the HTTP request
        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }
        
        // Send the HTTP request to create a new recommendation
        const { data } = await axios.post(
            `http://insightwearai.sytes.net:8000/api/create_recommendation/` + myUserId +`/`+ otherUserId,
            { 
            'text': description},
            config
        )
        
         // Dispatch a success action with the recommendation data
        dispatch({
            type:SEND_RECOMMEND_SUCCESS,
            payload: data
        })
    }catch(error){
        // If there is an error, dispatch a fail action with the error message
        dispatch({
            type: SEND_RECOMMEND_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
        
        // Log the error message to the console
        console.log(error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message)
            
    }
}
