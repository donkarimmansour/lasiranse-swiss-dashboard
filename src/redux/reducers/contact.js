import { COUNT, GET_CONTACTS, COUNT_NAV, VIEW, DELETE, COUNT_PAG, GET_ALl_CONTACTS, VIEW_ALL } from "../constans/contact"

const INITIAL_STATE = {
    count: 0,
    count_nav: 0,
    count_pag: 0,
    contacts: [],
    all_contacts: [],
}

const contactReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COUNT:
            return {
                ...state,
                count: action.payload
            }
        case COUNT_NAV:
            return {
                ...state,
                count_nav: action.payload
            }
        case GET_CONTACTS:

            return {
                ...state,
                contacts: action.payload
            }
        case GET_ALl_CONTACTS:

            return {
                ...state,
                all_contacts: action.payload
            }

        case COUNT_PAG:

            return {
                ...state,
                count_pag: action.payload
            }
        case VIEW:
            const index = state.contacts.findIndex(c => c._id === action.payload)           
           if(!state.contacts[index].viewed){
                state.contacts[index].viewed = true
                state.count_nav = state.count_nav - 1
            }

            return {
                ...state,
                contacts: state.contacts ,
                count_nav: state.count_nav

            }
            case VIEW_ALL:
                const indexA = state.all_contacts.findIndex(c => c._id === action.payload)           
               if(!state.all_contacts[indexA].viewed){
                    state.all_contacts[indexA].viewed = true
                    state.count_nav = state.count_nav - 1
                }
    
                return {
                    ...state,
                    all_contacts: state.all_contacts ,
                    count_nav: state.count_nav
                }
    
        case DELETE:
            const indexD = state.contacts.findIndex(c => c._id === action.payload)
            state.contacts.splice(indexD, 1)

            return {
                ...state,
                contacts: state.contacts ,
                count: state.count - 1
            }
        default: return state
    }
}

export default contactReducer