import { CLEAR_MESSAGE} from "../constans/message"

const clear_message = () => dispatch => {
    dispatch({
        type : CLEAR_MESSAGE
    })
}

export {
    clear_message
}