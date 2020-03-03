import userReducer from './user.reducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    user: userReducer
})

export default allReducers;