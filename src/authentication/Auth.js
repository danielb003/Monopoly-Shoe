import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Auth.css';
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
        };

        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleSignUpClick = this.handleSignUpClick.bind(this);
    }

    handleLoginClick = (type) => {
       this.setState({ type: type });
    }

    handleSignUpClick = (type) => {
       this.setState({ type: type });
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
                           ) : (
                              <Login />
                           ) }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}