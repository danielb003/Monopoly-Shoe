import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Auth from './authentication/Auth';
import Dashboard from './dashboard/Dashboard';
import firebase from 'firebase';
import { BrowserRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAvWYiVSH2CzepYSANoe-1T_7tA9hrIQAQ",
    authDomain: "programming-project-01-3438e.firebaseapp.com",
    databaseURL: "https://programming-project-01-3438e.firebaseio.com",
    projectId: "programming-project-01-3438e",
    storageBucket: "programming-project-01-3438e.appspot.com",
    messagingSenderId: "141480863825"
};

firebase.initializeApp(config);

const Root = () => (
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Home} />
            <Route path="/auth" component={Auth} />
            <Route path="/dashboard" component={Dashboard} />
        </div>
    </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

registerServiceWorker();
