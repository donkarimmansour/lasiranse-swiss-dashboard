
import { COUNT , GET_CONTACTS , COUNT_NAV , DELETE , VIEW, GET_ALl_CONTACTS, CREATE, VIEW_ALL, COUNT_PAG } from "../constans/contact"
import { SHOW_ERROR_MESSAGE, CLEAR_MESSAGE, SHOW_SUCCESS_MESSAGE } from "../constans/message"
import { START_LOADING, STOP_LOADING } from "../constans/loading"
import { Count, Create, Delete, List, View } from "../../services/contact"


const get_contact_Count = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

          
    if (!data.err) {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT , payload : data.msg
        })
    } else {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT , payload : -1
        })
    }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
    })
}




const get_contact_Count_pag = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

    if (!data.err) {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_PAG , payload : data.msg
        })
    } else {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT , payload : -1
        })
    }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })

    })
}

const get_contact_Count_nav = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

            dispatch({ type: STOP_LOADING })
            dispatch({
                type: COUNT_NAV , payload : data.msg
            })

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })

    })
}

const get_contact = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })

    List(filter , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: GET_CONTACTS , payload : data.msg
            })
            dispatch({ type: CLEAR_MESSAGE})
        } else {
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload : data.msg })
        }

    
        }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })

    })
}

const delete_contact = (id, con) => async dispatch => {
    dispatch({ type: START_LOADING })

    Delete(id, con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: DELETE , payload : id
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

const view_contact = (id , con) => async dispatch => {
    dispatch({ type: START_LOADING })

    View(id , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: VIEW , payload : id
            })
            dispatch({ type: CLEAR_MESSAGE})
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

const view_all_contact = (id , con) => async dispatch => {
    dispatch({ type: START_LOADING })

    View(id , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: VIEW_ALL , payload : id
            })
            dispatch({ type: CLEAR_MESSAGE})
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

const get_all_contacts = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    List(filter , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: GET_ALl_CONTACTS , payload : data.msg
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

const create_contact = (values) => async dispatch => {
    dispatch({ type: START_LOADING })

    Create(values).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: CREATE
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "created" })
        } else {
            
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload: data.msg })
        }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })

    })
}


export {
   get_contact_Count , get_contact , get_contact_Count_nav , view_contact ,
    delete_contact , get_all_contacts , get_contact_Count_pag , create_contact ,
    view_all_contact
}

