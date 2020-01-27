import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import allReducers from './reducers/all.reducer';


import Home from './components/home';
import './styles/commom.scss';



const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class App extends Component {
    render() { 
        return (
            <div>
                <Home />
            </div>
        );
    }
}
 
ReactDOM.render(<App />, document.getElementById('root'));