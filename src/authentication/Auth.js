import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Auth.css';
import Login from './Login';
import SignUp from './SignUp';

export default class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: null
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(type) {
       this.setState({ type: type });
    }

    render() {
        return (
            <div>
                <div id="container">
                   <Navbar inverse>
                      <Nav id="nav_box">
                         <NavItem className="nav_item">
                            <p>Prolific Trading</p>
                         </NavItem>
                      </Nav>
                      <Nav pullRight>
                         <NavItem className="nav_item" eventKey={2} href="/">
                            Home
                         </NavItem>
                      </Nav>
                   </Navbar>
                    <div id="auth_box">
                        <div id="auth_logo">
                            <p>Prolific Trading</p>
                        </div>
                        <div id="tabs">
                            <button id="login_tab" onClick={() => this.handleClick('login')} autoFocus>Log In</button>
                            <button id="signup_tab" onClick={() => this.handleClick('signup')}>Sign Up</button>
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