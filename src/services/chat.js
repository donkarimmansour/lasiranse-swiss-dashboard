import axios from "axios"
import {Host , ApiEndpoints} from "../common/apiEndPoints"

const config = {
    headers : {
       "Content-Type" : "application/json" 
    }  
}



const Create = async (data , con) => {
    return  await  axios.post(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.create}` 
    , data , { headers :  {...config.headers , ...con} })
  } 
  
  const Reply = async (id , data , con ) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.reply}/${id}` , data , { headers : {...config.headers , ...con } } )
  }
  const View = async (id , con ) => {
    return  await  axios.put(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.view}/${id}`, {}, { headers : {...config.headers , ...con } } )
  }
  const Delete = async (id , con ) => {
    return  await  axios.delete(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.delete}/${id}`, { headers : {...config.headers , ...con } } )
  }
  
  const Count = async (filter , con ) => {
    return  await  axios.get(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.count}`, { headers : {...config.headers , ...con } , params : {...filter} } )
  }
  
  const List = async (filter , con ) => {
    return  await  axios.get(`${Host.BACKEND}${ApiEndpoints.ChatEndpoints.route}${ApiEndpoints.ChatEndpoints.list}`, { headers : {...config.headers , ...con } , params : {...filter} } )
  }
  

  
export {
      Delete , Create , Count , List , Reply ,View
}