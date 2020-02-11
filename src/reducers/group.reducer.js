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
                hoster: action.hoster, 
                name: action.name,
                people: action.people,
                time: action.time,
                intensity: action.intensity,
            }
        default :
            return state
    }
}

export default groupReducer;