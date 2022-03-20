import { REPLY_CHAT, COUNT_CHAT, GET_CHAT, COUNT_CHAT_PAG, DELETE_CHAT, CREATE_CHAT , GET_SINGLE_CHAT, COUNT_CHAT_NAV, VIEW_CHAT } from "../constans/chat"

const INITIAL_STATE = {
    count: 0,
    count_pag: 0,
    count_nav: 0,
    chats: [],
    chat: {},
}


const chatsReducer = (state = INITIAL_STATE, action) => { 
    switch (action.type) {
        case COUNT_CHAT:
            return {
                ...state,
                count: action.payload
            }
            case COUNT_CHAT_NAV:
                return {
                    ...state,
                    count_nav: action.payload
                }
            case VIEW_CHAT:

            const index = state.chats.findIndex(c => c._id === action.payload)           
            if(!state.chats[index].viewed){
                state.chats[index].viewed = true
                state.count_nav = state.count_nav - 1
            }
            return {
                ...state,
                chats: state.chats ,
                count_nav: state.count_nav

            }
        case GET_CHAT:

            return {
                ...state,
                chats: action.payload
            }

        case COUNT_CHAT_PAG:

            return {
                ...state,
                count_pag: action.payload
            }
        case GET_SINGLE_CHAT:

        return {
                ...state,
                chat: action.payload[0]
            }
        case REPLY_CHAT:
            const indexE = state.chats.findIndex(c => c._id === action.payload._id)
            state.chats[indexE] = action.payload

            return {
                ...state,
                chats: state.chats,
                count_nav: state.count_nav - 1,
            } 
        case CREATE_CHAT:
            state.chats.push(action.payload)
            return {
                ...state,
                chats: state.chats,
                count: (state.count + 1),
                count_pag: (state.count_pag + 1),
            }

        case DELETE_CHAT:
            const indexD = state.chats.findIndex(c => c._id === action.payload)
            state.chats.splice(indexD, 1)

            return {
                ...state,
                CHATs: state.chats,
                count: (state.count - 1),
                count_pag: (state.count_pag - 1),
                count_nav: (state.count_nav - 1),
            }
        default: return state

    }
}

export default chatsReducer