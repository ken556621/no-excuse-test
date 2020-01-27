const initiaState = {
    name: String,
    email: String,
    password: String
}

const registerReducer = (state = initiaState, action) => {
    switch (action.type){
        case 'UPDATE_NAME':
            return state.name
        case 'UPDATE_EMAIL':
            return state.email
        case 'UPDATE_PASSWORD':
            return state.password
        default :
            return state
    }
}

export default registerReducer;