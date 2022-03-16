
import { REPLY_CHAT, COUNT_CHAT, GET_CHAT, COUNT_CHAT_PAG, DELETE_CHAT, CREATE_CHAT , GET_SINGLE_CHAT} from "../constans/chat"
import { SHOW_ERROR_MESSAGE, SHOW_SUCCESS_MESSAGE, CLEAR_MESSAGE } from "../constans/message"
import { START_LOADING, STOP_LOADING } from "../constans/loading"
import {  Count, Delete, Create, List, Reply } from "../../services/chat"



const get_chats_Count_pag = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

    if (!data.err) {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_CHAT_PAG , payload : data.msg
        })
    } else {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_CHAT_PAG , payload : -1
        })
    }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })

    })
}


const get_chats_Count = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

          
    if (!data.err) {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_CHAT , payload : data.msg
        })
    } else {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_CHAT , payload : -1
        })
    }

  }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
    })
}




const get_all_chats = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    List(filter , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: GET_CHAT , payload : data.msg
            })
            dispatch({ type: CLEAR_MESSAGE })
        } else {
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload : data.msg })
        }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })


    })
}

const get_chat = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    List(filter , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: GET_SINGLE_CHAT , payload : data.msg
            })
            dispatch({ type: CLEAR_MESSAGE })
        } else {
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload : data.msg })
        }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })


    })
}

const ReplyChat = (id , values , authorization) => async dispatch => {
    dispatch({ type: START_LOADING })

    Reply(id , values , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: REPLY_CHAT , payload : data.msg
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "updated" })
            
        } else {
            
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload: data.msg })
        }

      //  console.log(data);

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })

    })
}

const createChat = (values , authorization) => async dispatch => {
    dispatch({ type: START_LOADING })

    Create(values , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: CREATE_CHAT , payload : data.msg
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "created" })
            
        } else {
            
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload: data.msg })
        }

      //  console.log(data);

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })

    })
}




const delete_chat = (id, con) => async dispatch => {
    dispatch({ type: START_LOADING })

    Delete(id, con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: DELETE_CHAT , payload : id
            })
            dispatch({ type: CLEAR_MESSAGE })
        } else {
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload : data.msg })
        }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })

    })
}




export {
     get_chats_Count , get_chats_Count_pag , get_all_chats ,
      get_chat ,  delete_chat , createChat , ReplyChat
}

 