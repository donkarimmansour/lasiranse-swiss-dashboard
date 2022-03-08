import {SHOW_ERROR_MESSAGE , SHOW_SUCCESS_MESSAGE , CLEAR_MESSAGE} from "../constans/message"

const INITIAL_STATE = {
    errorMsg : "" ,
    successMsg : ""
}

const messageReducer = (state = INITIAL_STATE , action) => {
    switch(action.type){
        case SHOW_SUCCESS_MESSAGE : 
        return {
            ...state ,
            successMsg : action.payload
        }
        case SHOW_ERROR_MESSAGE : 
        return {
            ...state ,
            errorMsg : action.payload
        } 
        case CLEAR_MESSAGE : 
        return {
            ...state ,
            errorMsg : "" ,
            successMsg : ""
        }
        default : return state
    }
}

export default messageReducer