import axios from "axios"
import {Host , ApiEndpoints} from "../common/apiEndPoints"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const Create = async (data ) => {

  return  await  axios.post(`${Host.BACKEND}${ApiEndpoints.contactEndpoints.route}${ApiEndpoints.contactEndpoints.create}` 
  , data , { headers :  {...config.headers } })
} 

const Delete = async (id , con ) => {
  return  await  axios.delete(`${Host.BACKEND}${ApiEndpoints.contactEndpoints.route}${ApiEndpoints.contactEndpoints.delete}/${id}`, { headers : {...config.headers , ...con } } )
}

const View = async (id , con ) => {
  return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.contactEndpoints.route}${ApiEndpoints.contactEndpoints.view}/${id}`, {}, { headers : {...config.headers , ...con } } )
}

const Count = async (filter , con ) => {
  return  await  axios.get(`${Host.BACKEND}${ApiEndpoints.contactEndpoints.route}${ApiEndpoints.contactEndpoints.count}`, { headers : {...config.headers , ...con } , params : {...filter} } )
}

const List = async (filter , con ) => {
  return  await  axios.get(`${Host.BACKEND}${ApiEndpoints.contactEndpoints.route}${ApiEndpoints.contactEndpoints.list}`, { headers : {...config.headers , ...con } , params : {...filter} } )
}

export {
 Create , Count , List , View , Delete
}