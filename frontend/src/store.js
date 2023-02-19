import { createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { userRegisterReducer, 
        userLoginReducer, 
        userProfileReducer } from './reducers/userReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userProfile: userProfileReducer
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