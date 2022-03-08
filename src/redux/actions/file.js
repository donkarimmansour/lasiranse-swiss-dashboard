
import { UPLOAD_SINGE_IMAGE } from "../constans/file"
import { SHOW_ERROR_MESSAGE, CLEAR_MESSAGE } from "../constans/message"
import { Create } from "../../services/file"
import { START_LOADING, STOP_LOADING } from "../constans/loading"
import { updateImageProfile } from "./user"

const set_single_image = (image , authorization , id) => async dispatch => {
    dispatch({ type: START_LOADING })

    Create(image, authorization).then(({ data }) => {

        if (!data.err) {
            dispatch({ type: STOP_LOADING })
            dispatch({
                type: UPLOAD_SINGE_IMAGE,
                payload:  data.msg
            })
            dispatch({ type: CLEAR_MESSAGE})
            dispatch(updateImageProfile(id , { image : data.msg } , authorization))
           // dispatch({ type: SHOW_SUCCESS_MESSAGE , payload : "uploaded"})
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

export {
    set_single_image
}

