import { Host } from "../common/apiEndPoints"

const ImageLink = (img) => {
    return  `${Host.BACKEND}${Host.PREFIX}/file/get-single-image/${img}/view`
}




const extractDesk = (desk , length) => {
    if(desk.length > length){
         return desk.substr(0 , length)
    }else {
        return desk
    }
}


export { ImageLink , extractDesk}  