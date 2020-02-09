import userReducer from './user.reducer';
import locationReducer from './location.reducer';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    user: userReducer,
    location: locationReducer
})

export default allReducers;