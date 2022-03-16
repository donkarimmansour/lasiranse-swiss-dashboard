import { Host } from "../common/apiEndPoints"
import * as XLSX  from 'xlsx'

const ImageLink = (img) => {
    return  `${Host.BACKEND}${Host.PREFIX}/file/get-single-image/${img}/view`
}


const countDown = (end) => {
    var today = new Date().getTime();
    var d = new Date(end).getTime() - today;
    var days = Math.floor(d / (1000 * 60 * 60 * 24));
    var hr = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var min = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var sec = Math.floor((d % (1000 * 60)) / 1000);

    if(!end){
        return {days : 0, hr  : 0 ,  min  : 0 , sec  : 0 }
    }
    return {days, hr  ,  min  , sec } 
}


const extractDesk = (desk , length) => {
    if(desk.length > length){
         return desk.substr(0 , length)
    }else {
        return desk
    }
}

const convertJsonToExcel = (name , data) => {
    
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workBook, workSheet, name)

    // // Generate buffer
    // XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

    // // Binary string
    // XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

    XLSX.writeFile(workBook, name + "Data.xlsx")

}


export { ImageLink , extractDesk , countDown , convertJsonToExcel}  