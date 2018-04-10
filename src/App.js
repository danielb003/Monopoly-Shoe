import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import Login from './authentication/Login';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
          <Route exact path="/" render={() => (
              <div>
                  <a href="/login" style={{ textDecoration: "none", color: "black" }}>Login</a>
              </div>
          )} />

          <Route exact path="/login" render={()  => (
              <div>
                  <a href="/" style={{ textDecoration: "none", color: "black" }}>Home</a>
                  <div id="container">
                      <div id="auth_box">
                          <div id="auth_logo">
                              <p>Prolific Trading</p>
                          </div>
                          <div>
                              <button>Log In</button>
                              <button>Sign Up</button>
                          </div>
                          <div>
                              <button>Log In</button>
                          </div>
                      </div>
                  </div>
              </div>
          )} />

      </div>
    );
  }
}

export default App;
