import axios from "axios"
import {Host , ApiEndpoints} from "../common/apiEndPoints"

const config = {
    headers : {
       "Content-Type" : "multipart/form-data" 
    }  
}

const Create = async (data , con) => {
  return  await  axios.post(`${Host.BACKEND}${ApiEndpoints.FileEndpoints.route}${ApiEndpoints.FileEndpoints.createSingleImage}` 
  , data , { headers :  {...config.headers , ...con } })
} 


export {
 Create
}