import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/configStore';
import AppContainer from './components/AppContainer';

import './styles/commom.scss';




class App extends Component {
    render() { 
        return (
            <Provider store={ store }>
                <AppContainer />
            </Provider>
        );
    }
}

if("serviceWorker" in navigator){
    console.log(navigator.serviceWorker.register('/sw.js'))
    // navigator.serviceWorker.register()
    // .then(() => console.log('work'))
    // .catch(() => console.log('not work'))
}
 
ReactDOM.render(<App />, document.getElementById('root'));
