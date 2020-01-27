const initiaState = {
    status: Boolean
}

const loginReducer = (state = initiaState, action) => {
    switch (action.type){
        case 'LOGIN':
            return state.status = true
        case 'LOGOUT':
            return state.status = false
        default :
            return state
    }
}

export default loginReducer;