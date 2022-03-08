import { createStore, applyMiddleware , combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import loadingReducer from './reducers/loading';
import messageReducer from './reducers/message';
import userReducer from './reducers/user';
import contactReducer from './reducers/contact';
import fileReducer from './reducers/file';


const middlewares = [thunk]

const reducer = combineReducers({
    loading : loadingReducer ,
    message : messageReducer ,
    user : userReducer ,
    contact : contactReducer ,
    file : fileReducer ,
})

const initialState = {}

const store = createStore(reducer , initialState , composeWithDevTools(applyMiddleware(...middlewares)))

export default store ;