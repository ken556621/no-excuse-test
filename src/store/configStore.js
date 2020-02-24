import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import ReduxThunk from 'redux-thunk'

import allReducers from '../reducers/all.reducer';


const initiaState = {};

const store = createStore(
    allReducers,
    initiaState,
    composeWithDevTools(
      applyMiddleware(ReduxThunk),
      offline(offlineConfig)
    )
  );

export default store;