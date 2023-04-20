// Import axios for making HTTP requests
import axios from "axios";

// Import action constants from userConstants.js
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

    UPLOAD_DOCUMENTS_REQUEST,
    UPLOAD_DOCUMENTS_SUCCESS,
    UPLOAD_DOCUMENTS_FAIL,
} from '../constants/userConstants'

// Action creator to get profile details of a user with the given ID
export const getProfileDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
        })
        
        // Get the user's login information from the global state
        const { 
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`   // Add the user's token to the authorization header
            }
        }

        const { data } = await axios.get(
            `http://localhost:8000/api/profile/${id}`, // Send a GET request to the backend API to get the user's profile details with the given ID
            config
        )

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data   // Dispatch the USER_DETAILS_SUCCESS action with the profile details as the payload
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,    // Dispatch the USER_DETAILS_FAIL action with the error message as the payload
        })
    }
}

// Action creator to log in a user with the given email and password
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
            'http://localhost:8000/api/login/', // Send a POST request to the backend API to log in the user
            { 'username': email, 'password': password },
            config
        )
        
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data   // Dispatch the USER_LOGIN_SUCCESS action with the user's login information as the payload
        })
        localStorage.setItem('userInfo', JSON.stringify(data))  // Store the user's login information in local storage

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,    // Dispatch the USER_LOGIN_FAIL action with the error message as the payload
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


// Action creator to log out the user
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo') // Remove the user's login information from local storage
    dispatch({ type: USER_LOGOUT }) // Dispatch the USER_LOGOUT action
}

// Action creator to register a user with the given name, email, and password
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

// This function gets a user profile from the server by ID
export const get_profile = (id) => async (dispatch, getState) => {
    try {
        
        // Dispatches a GET_PROFILE_REQUEST action to start the request
        dispatch({
            type: GET_PROFILE_REQUEST
        })
        
         // Gets the user info from the current state
        const { 
            userLogin: { userInfo },
        } = getState()

      
         // Configures the headers for the request
        const config = {
            headers: {
                'Content-type': 'application/json',
                //Authorization: `Bearer ${userInfo.token}`
            }
        }

        // Sends a GET request to the server to get the profile by ID
        const { data } = await axios.get(
            `http://localhost:8000/api/profile/` + id, 
            config
        )

         // Dispatches a GET_PROFILE_SUCCESS action with the retrieved data
        dispatch({
            type: GET_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
         // Dispatches a GET_PROFILE_FAIL action with the error message
        dispatch({
            type: GET_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

// This function updates a user's profile on the server
export const update_profile = (uID, name, title, city, about, experience, education, image, work, volunteering, courses, projects, awards, languages) => async (dispatch, getState) => {
    try {
        
        // Dispatches an UPDATE_PROFILE_REQUEST action to start the request
        dispatch({
            type: UPDATE_PROFILE_REQUEST
        })
        
        // Gets the user info from the current state
        const {
            userLogin: {userInfo},
        } = getState()

        // Configures the headers for the request
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        
        // Sends a PUT request to the server to update the user's profile
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

        // Dispatches an UPDATE_PROFILE_SUCCESS action with the updated data
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data
        })
    } catch (error) {
        // Dispatches an UPDATE_PROFILE_FAIL action with the error message
        console.log('updating post failed')
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}

// This function updates a user's profile on the server
export const upload_document = (uID, resume, coverLetter) => async (dispatch) => {
    try {
        
        // Dispatches an UPDATE_PROFILE_REQUEST action to start the request
        dispatch({
            type: UPLOAD_DOCUMENTS_REQUEST
        })
        
        // Configures the headers for the request
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'}
        }
        
        // Sends a POST request to upload user's resume and cover letter
        const { data } = await axios.post(`http://localhost:8000/api/documentsUpload/${uID}/`, 
            {'resume': resume, 
            'coverLetter': coverLetter, 
            }, 
            config)

        // Dispatches an UPLOAD_DOCUMENTS_SUCCESS action with the upload documents
        dispatch({
            type: UPLOAD_DOCUMENTS_SUCCESS,
            payload: data
        })
    } catch (error) {
        // Dispatches an UPLOAD_DOCUMENTS_FAIL action with the error message
        console.log('upload documents failed')
        dispatch({
            type: UPLOAD_DOCUMENTS_FAIL,
            payload: error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
        })
    }
}
