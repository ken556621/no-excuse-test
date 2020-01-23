import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Login from './components/login';
import './styles/commom.scss';





class App extends Component {
    render() { 
        return (
            <div>
                <Login />
            </div>
        );
    }
}
 
ReactDOM.render(<App />, document.getElementById('root'));