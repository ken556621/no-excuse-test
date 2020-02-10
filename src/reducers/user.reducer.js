const initiaState = {
    authenticated: false,
    authenticating: false
}

const registerReducer = (state = initiaState, action) => {
    switch (action.type){
        case 'LOGIN_SUCCESS':
            return {
                ...state, 
                authenticating: false,
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
        case 'UPDATE_USER':
            return {
                ...state,
                uid: action.uid,
                name: action.name,
                email: action.email,
                photo: action.photo,
                friends: action.friends
            }
        default :
            return state
    }
}

export default registerReducer;