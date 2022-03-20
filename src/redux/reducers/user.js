import { EDITE_ADMIN, COUNT_ADMIN, GET_ADMIN, COUNT_ADMIN_PAG, DELETE_ADMIN, CREATE_ADMIN , GET_SINGLE_ADMIN, COUNT_ADMIN_NAV, SUSPENDED } from "../constans/user"

const INITIAL_STATE = {
    count: 0,
    count_pag: 0,
    count_nav: 0,
    admins: [],
    admin: {},
}


const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case COUNT_ADMIN:
            return {
                ...state,
                count: action.payload
            }
            case COUNT_ADMIN_NAV:
                return {
                    ...state,
                    count_nav: action.payload
                }
            case SUSPENDED:

                if(action.payload.c == "inc"){
                    state.count_nav += 1
                }else{
                    state.count_nav -= 1
                }
                return {
                    ...state,
                    count_nav: state.count_nav
                }
    
        case GET_ADMIN:

            return {
                ...state,
                admins: action.payload
            }

        case COUNT_ADMIN_PAG:

            return {
                ...state,
                count_pag: action.payload
            }
        case GET_SINGLE_ADMIN:
            return {
                ...state,
                admin: action.payload[0]
            }
        case EDITE_ADMIN:
            const indexE = state.admins.findIndex(c => c._id === action.payload._id)
            state.admins[indexE] = action.payload

            return {
                ...state,
                admins: state.admins,
            } 
        case CREATE_ADMIN:
            state.admins.push(action.payload)
            return {
                ...state,
                admins: state.admins,
                count: (state.count + 1),
                count_pag: (state.count_pag + 1),
                count_nav: action.payload.isAccountSuspended ? state.count_nav + 1 : state.count_nav,
            }

        case DELETE_ADMIN:
            const indexD = state.admins.findIndex(c => c._id === action.payload.id)
            state.admins.splice(indexD, 1)

            return {
                ...state,
                admins: state.admins,
                count: (state.count - 1),
                count_pag: (state.count_pag - 1),
                count_nav: action.payload.isAccountSuspended ? state.count_nav - 1 : state.count_nav,
            }
        default: return state

    } 
}

export default userReducer