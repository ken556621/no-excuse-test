const initiaState = {
    authenticated: false,
    authenticating: false
}

const registerReducer = (state = initiaState, action) => {
    switch (action.type){
        case 'LOGIN_SUCCESS':
            return {
                ...state, 
                authenticated: true
            }
        case 'LOGIN_FAIL':
            return {
                ...state,
                authenticating: false,
                authenticated: false
            }
        case 'LOGOUT':
            return {
                ...state,
                authenticating: true,
                authenticated: false
            }
        default :
            return state
    }
}

export default registerReducer;