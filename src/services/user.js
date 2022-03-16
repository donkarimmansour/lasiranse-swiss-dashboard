import axios from "axios"
import {Host , ApiEndpoints} from "../common/apiEndPoints"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}

const EditAccount = async (id , data , con) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.edit}/${id}`, data , { headers : {...config.headers , ...con} } )
}

const updateAccount = async (id , data , con) => {
  return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.update}/${id}`, data , { headers : {...config.headers , ...con} } )
}


const Image = async (id , data , con) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.image}/${id}`, data , { headers : {...config.headers , ...con} } )
}


const Create = async (data , con) => {
    return  await  axios.post(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.create}` 
    , data , { headers :  {...config.headers , ...con} })
  } 
  
  const Delete = async (id , con ) => {
    return  await  axios.delete(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.delete}/${id}`, { headers : {...config.headers , ...con } } )
  }
  
  const Count = async (filter , con ) => {
    return  await  axios.get(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.count}`, { headers : {...config.headers , ...con } , params : {...filter} } )
  }
  
  const List = async (filter , con ) => {
    return  await  axios.get(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.list}`, { headers : {...config.headers , ...con } , params : {...filter} } )
  }
  

  
export {
     Image , EditAccount , Delete , Create , Count , List , updateAccount
}