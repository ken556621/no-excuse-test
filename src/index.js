import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store/configStore';
import AppContainer from './components/Appcontainer';

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
 
ReactDOM.render(<App />, document.getElementById('root'));
