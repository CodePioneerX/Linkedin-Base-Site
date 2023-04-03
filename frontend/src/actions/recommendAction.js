import axios from "axios";

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
        dispatch({
            type: SEND_RECOMMEND_REQUEST
        })

        const { 
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
            }
        }

        const { data } = await axios.post(
            `http://insightwearai.sytes.net:8000/api/create_recommendation/` + myUserId +`/`+ otherUserId,
            { 
            'text': description},
            config
        )

        dispatch({
            type:SEND_RECOMMEND_SUCCESS,
            payload: data
        })
    }catch(error){
        dispatch({
            type: SEND_RECOMMEND_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })

        console.log(error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message)
            
    }
}