import { createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userRegisterReducer, 
        userLoginReducer, 
        userProfileReducer,
        updateTokenReducer } from './reducers/userReducers'

import {notificationsReducer,
        notificationsCheckNewReducer,
        notificationClearReducer,
        notificationCountReducer,
        notificationDeleteReducer,
        notificationReadReducer
    } from './reducers/notificationReducers'

import { createJobAlertReducer } from './reducers/jobReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userProfile: userProfileReducer,
    updateToken: updateTokenReducer,
    
    notifications: notificationsReducer,
    notificationsCheckNew: notificationsCheckNewReducer,
    notificationClear: notificationClearReducer,
    notificationCount: notificationCountReducer,
    notificationRead: notificationReadReducer,
    notificationDelete: notificationDeleteReducer,

    createJobAlert: createJobAlertReducer
})

const userInfoFromStorage = localStorage.getItem("userInfo") ? 
        JSON.parse(localStorage.getItem("userInfo")) : null

        
const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
 
    userProfile: { }
}
const middleware = [thunk]

const store = createStore(reducer, initialState, 
    composeWithDevTools(applyMiddleware(...middleware)))

export default store;
