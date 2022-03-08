import { UPLOAD_SINGE_IMAGE } from "../constans/file"

const INITIAL_STATE = {
    image: ""
}

const subscribeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPLOAD_SINGE_IMAGE:
            return {
                image: action.payload
            }
        default: return state
    }
}

export default subscribeReducer