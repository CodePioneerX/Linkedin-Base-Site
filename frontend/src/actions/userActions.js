import axios from "axios";

import{
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
    CHANGE_PASSWORD_FAIL,

    CHANGE_PASSWORD_FOR_RESET_REQUEST,
    CHANGE_PASSWORD_FOR_RESET_SUCCESS,
    CHANGE_PASSWORD_FOR_RESET_FAIL,

    FORGOT_PASSWORD_EMAIL_REQUEST_REQUEST,
    FORGOT_PASSWORD_EMAIL_REQUEST_SUCCESS,
    FORGOT_PASSWORD_EMAIL_REQUEST_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,

    GET_PROFILE_REQUEST,
    GET_PROFILE_SUCCESS,
    GET_PROFILE_FAIL,

    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
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


/**
 * A function that sends a request to change the user's password in order to reset it.
 * @param id the ID of the user whose password needs to be changed.
 * @param newPassword the new password to set for the user.
 * @return an object with success and message properties indicating whether the password was changed successfully or not.
 * @throws Error if there is an error sending the request to the server.
*/
export const changePasswordForReset = (id, newPassword) => async (dispatch) => {
    try {
      dispatch({
        type: CHANGE_PASSWORD_FOR_RESET_REQUEST,
      });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const { data } = await axios.put(
        `http://localhost:8000/api/changePasswordForReset/${id}`,
        { newPassword },
        config
      );
  
      localStorage.setItem("userInfo", JSON.stringify(data));
  
      dispatch({
        type: CHANGE_PASSWORD_FOR_RESET_SUCCESS,
        payload: data,
      });
  
      return { success: true, message: "Password changed successfully!" };
    } catch (error) {
      dispatch({
        type: CHANGE_PASSWORD_FOR_RESET_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
  
      return { success: false, message: error.message };
    }
  };


/**
 * Sends a PUT request containing oldPassword and newPassword to the following url: `http://localhost:8000/api/changePassword/${id}`.
 * This method can be used when a user is logged in. 
 * 
 * @param {int} id 
 * @param {String} oldPassword 
 * @param {String} newPassword 
 * @returns 
 * @throws Error if there is an error sending the request to the server.
 */
export const changePassword = (id, oldPassword, newPassword) => async (dispatch) => {
    try {
      dispatch({
        type: CHANGE_PASSWORD_REQUEST,
      });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const { data } = await axios.put(
        `http://localhost:8000/api/changePassword/${id}`,
        { oldPassword, newPassword },
        config
      );
  
      localStorage.setItem("userInfo", JSON.stringify(data));
  
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        payload: data,
      });
  
      return { success: true, message: "Password changed successfully!" };
    } catch (error) {
      dispatch({
        type: CHANGE_PASSWORD_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
  
      return { success: false, message: error.message };
    }
  };


/**
 * Sends a request to the server to reset the password for the given email.
 * @param {string} email - The email of the user requesting the password reset.
 * @return {Object} An object containing information about the status of the request.
 * @throws {Error} If the request fails.
 * */
export const forgotPasswordEmailRequest = (email) => async (dispatch) => {
try {
    dispatch({
    type: FORGOT_PASSWORD_EMAIL_REQUEST_REQUEST,
    });

    const config = {
    headers: {
        "Content-type": "application/json",
    },
    };

    const { data } = await axios.put(
    `http://localhost:8000/api/password_reset/`,
    { email },
    config
    );

    dispatch({
    type: FORGOT_PASSWORD_EMAIL_REQUEST_SUCCESS,
    payload: data,
    });

    return { success: true, message: "Email sent successfully! Please check your inbox." };
} catch (error) {
    dispatch({
    type: FORGOT_PASSWORD_EMAIL_REQUEST_FAIL,
    payload:
        error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });

    return { success: false, message: error.message + "There was an error sending the email. Please make sure that the email entered is correct and try again." };
}
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
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

    } catch (error) {
        console.log("register failed")
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const get_profile = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: GET_PROFILE_REQUEST
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
            `http://localhost:8000/api/profile/` + id, 
            config
        )

        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: GET_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const update_profile = (uID, name, title, city, about, experience, education, image, work, volunteering, courses, projects, awards, languages) => async (dispatch, getState) => {
    try {
        dispatch({
            type: UPDATE_PROFILE_REQUEST
        })

        const {
            userLogin: {userInfo},
        } = getState()

        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        const { data } = await axios.put(`http://localhost:8000/api/profile/update/` + uID, 
            {'name': name, 
            'title': title, 
            'city': city, 
            'about': about,
            'experience': experience,
            'education': education, 
            'work': work, 
            'volunteering': volunteering,
            'courses': courses, 
            'projects': projects, 
            'awards': awards, 
            'languages': languages}, 
            config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
        console.log('updating post failed')
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}
