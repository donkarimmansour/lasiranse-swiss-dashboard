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


const Image = async (id , data , con) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.UserEndpoints.route}${ApiEndpoints.UserEndpoints.image}/${id}`, data , { headers : {...config.headers , ...con} } )
}

  
export {
     Image , EditAccount
}