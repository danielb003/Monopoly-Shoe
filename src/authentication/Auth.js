import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Auth.css';
import firebase from "firebase";
import Login from './Login';
import SignUp from './SignUp';

export default class Auth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            phonenumber: '',
            tradingaccount: false,
            admin: false,
        }

        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleSignUpClick = this.handleSignUpClick.bind(this);
    }

    handleLoginClick = (type) => {
       this.setState({ type: type });
    }

    handleSignUpClick = (type) => {
       this.setState({ type: type });
    }

   handleLogin = (email, password) => {
       alert("Inside hangleLogin");
      firebase.auth().signInWithEmailAndPassword(email, password)
         .catch(function(error) {
            // Handle errors
            var errorCode = error.code;
            var errorMessage = error.message;
         });
   }

   handleRegister = (name, email, password) => {
      alert("Inside hangleRegister");
      const user = {};
      user['user/' + this.state.user.uid] = {
         name: name,
         email: email,
         password: password
      };

      firebase.auth().createUserWithEmailAndPassword(email, password)
         .catch(function(error) {
            // Handle errors
            var errorCode = error.code;
            var errorMessage = error.message;
         });
   }

    render() {
       const type = this.state.type;
        return (
            <div>
                <div id="container">
                   <Navbar inverse>
                      <Nav>
                         <NavItem>
                            <p>Prolific Trading</p>
                         </NavItem>
                      </Nav>
                      <Nav pullRight>
                         <NavItem eventKey={2} href="/">
                            Home
                         </NavItem>
                      </Nav>
                   </Navbar>
                    <div id="auth_box">
                        <div id="auth_logo">
                            <p>Prolific Trading</p>
                        </div>
                        <div id="tabs">
                            <button id="login_tab" onClick={() => this.handleLoginClick('login')}>Log In</button>
                            <button id="signup_tab" onClick={() => this.handleSignUpClick('signup')}>Sign Up</button>
                        </div>
                        <div id="pane">
                        { this.state.type === 'login' ? (
                              <Login />
                           )
                           : this.state.type === 'signup' ? (
                              <SignUp />
                           ) :null }
                        </div>
                        <div id="login_bar">
                           <button id="login"><a href="/dashboard" style={{ textDecoration: "none", color: "black" }}>Log In</a></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}