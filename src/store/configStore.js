import { applyMiddleware, createStore, compose } from 'redux';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import ReduxThunk from 'redux-thunk'

import allReducers from '../reducers/all.reducer';


const initiaState = {};

const store = createStore(
    allReducers,
    initiaState,
    compose(
      applyMiddleware(ReduxThunk),
      offline(offlineConfig),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );

export default store;