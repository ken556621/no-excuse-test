import authReducer from './auth.reducer';
import registerReducer from './register.reducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    auth: authReducer,
    register: registerReducer
})

export default allReducers;