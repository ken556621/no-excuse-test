const initiaState = {
    name: '',
    people: '',
    time: '',
    intensity: ''
}

const groupReducer = (state = initiaState, action) => {
    switch (action.type){
        case 'STORE_GROUPS':
            return {
                ...state, 
                name: action.name,
                people: action.id,
                time: action.address,
                intensity: action.photo,
            }
        default :
            return state
    }
}

export default groupReducer;