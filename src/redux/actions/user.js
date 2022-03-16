
import { LOGIN , FORGOT , EDITE_ADMIN , IMAGE , COUNT_ADMIN ,GET_ADMIN , COUNT_ADMIN_PAG , DELETE_ADMIN , SIGNUP , CREATE_ADMIN, GET_SINGLE_ADMIN} from "../constans/user"
import { SHOW_ERROR_MESSAGE, SHOW_SUCCESS_MESSAGE, CLEAR_MESSAGE } from "../constans/message"
import { START_LOADING, STOP_LOADING } from "../constans/loading"
import { Image, EditAccount, Count, Delete, Create, List, updateAccount } from "../../services/user"
import { ForgotAuth, LoginAuth, SignupAuth } from "../../services/auth"
import { setAuthentication } from "../../shared/auth"
import { getLocalStorage, setLocalStorage } from "../../shared/localStorage"



const get_admin_Count_pag = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

    if (!data.err) {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_ADMIN_PAG , payload : data.msg
        })
    } else {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_ADMIN_PAG , payload : -1
        })
    }

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })

    })
}


const get_admin_Count = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    Count(filter , con).then(({ data }) => {

          
    if (!data.err) {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_ADMIN , payload : data.msg
        })
    } else {
        dispatch({ type: STOP_LOADING })
        dispatch({
            type: COUNT_ADMIN , payload : -1
        })
    }

  }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
    })
}

const LoginAuths = (values) => async dispatch => {
    dispatch({ type: START_LOADING })

    LoginAuth(values).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: LOGIN
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "okey" })
        } else {
            
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload: data.msg })
        }

       setAuthentication(data.msg.TOKEN , data.msg.USER)

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })

    })
}


const SignupAuths = (values) => async dispatch => {
    dispatch({ type: START_LOADING })

    SignupAuth(values).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: SIGNUP
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "created" })
        } else {

            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload: data.msg })
        }

     //   console.log(data);

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })

    })
}


const ForgotAuths = (values) => async dispatch => {
    dispatch({ type: START_LOADING })

    ForgotAuth(values).then(({ data }) => {
        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: FORGOT
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "forgot" })

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




const get_all_admins = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    List(filter , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: GET_ADMIN , payload : data.msg
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

const get_admin = (filter , con) => async dispatch => {
    dispatch({ type: START_LOADING })
    List(filter , con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: GET_SINGLE_ADMIN , payload : data.msg
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


const EditAccounts = (userId , values , authorization) => async dispatch => {
    dispatch({ type: START_LOADING })

    EditAccount(userId , values , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            // dispatch({
            //     type: EDITE_ADMIN
            // })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "updated" })
            
            setLocalStorage("user" , {...getLocalStorage("user") , ...values})

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

const updateAccounts = (userId , values , authorization) => async dispatch => {
    dispatch({ type: START_LOADING })

    updateAccount(userId , values , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: EDITE_ADMIN , payload : data.msg
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

const createAccount = ( values , authorization) => async dispatch => {
    dispatch({ type: START_LOADING })

    Create(values , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: CREATE_ADMIN , payload : data.msg
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




const delete_admin = (id, con) => async dispatch => {
    dispatch({ type: START_LOADING })

    Delete(id, con).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: DELETE_ADMIN , payload : id
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


const updateImageProfile = (userId , values , authorization) => async dispatch => {
    dispatch({ type: START_LOADING })

    Image(userId , values , authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch({ type: IMAGE})

            setLocalStorage("user" ,{...getLocalStorage("user") , image : data.msg })
            dispatch({ type: SHOW_SUCCESS_MESSAGE, payload : "updated" })
        } else {
            
            dispatch({ type: STOP_LOADING })
            dispatch({ type: SHOW_ERROR_MESSAGE, payload: data.msg })
        }

        console.log(data);

    }).catch(err => {
        console.log("get orders api err ", err);
        dispatch({ type: STOP_LOADING })
        dispatch({ type: SHOW_ERROR_MESSAGE, payload: "something went wrong please try again" })

    })
}



export {
     LoginAuths , ForgotAuths , updateImageProfile , EditAccounts , SignupAuths , updateAccounts , get_admin ,
     get_admin_Count , get_admin_Count_pag , delete_admin  , get_all_admins , createAccount
}

