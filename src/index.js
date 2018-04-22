import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Auth from './authentication/Auth';
import Logout from './authentication/Logout';
import Dashboard from './dashboard/Dashboard';
import firebase from 'firebase';
import { BrowserRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase

const Root = () => (
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/logout" component={Logout}/>
        </div>
    </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

registerServiceWorker();