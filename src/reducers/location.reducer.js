const initiaState = {
    id: '',
    name: '',
    address: '',
    photo: ''
}

const locationReducer = (state = initiaState, action) => {
    switch (action.type){
        case 'STORE_COURTS':
            return {
                ...state, 
                id: action.id,
                name: action.name,
                address: action.address,
                photo: action.photo
            }
        default :
            return state
    }
}

export default locationReducer;