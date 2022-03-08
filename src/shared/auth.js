import {setCookie , getCookie , removeCookie} from "./cookie"
import {setLocalStorage , getLocalStorage , removeLocalStorage} from "./localStorage"
import Jwt_decode from "jwt-decode"



const setAuthentication = (token , user ) => {
    setLocalStorage("user" , user)
    setCookie("token" , token)
 
} 

const isAuthentication = () => {

    try { 
        if (getLocalStorage("user") && getCookie("token")) {
            if((new Date()/1000) < Jwt_decode(getCookie("token")).exp){

               return true
            }else {
              Logout(() => {})
            }
              
        }else {
            Logout(() => {})
        }

    } catch (err) { 
        console.log(err);
    }
   
}

const Logout = next => {
    removeCookie("token")
    removeLocalStorage("user")
     
    next()
}

export {
    setAuthentication ,
    isAuthentication ,
    Logout
}