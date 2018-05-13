import React, { Component } from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'
import FormValidator from './FormValidator';

export default class Login extends Component {
   constructor(props) {
      super(props);

      this.validator = new FormValidator([
         {
            field: 'email',
            method: 'isEmpty',
            validWhen: false,
            message: 'Email is required.'
         },
         {
            field: 'email',
            method: 'isEmail',
            validWhen: true,
            message: 'Email is not a valid address'
         },
         {
            field: 'password',
            method: 'isEmpty',
            validWhen: false,
            message: 'Password is required.'
         },
         {
            field: 'password',
            method: 'matches',
            args: [ /(?:[^\/\\\.\,\+\=\~]{9,})/],
            validWhen: true,
            message: 'Password must be 9 or more characters'
         }
      ]);

      this.state = {
         redirect: false,
         email: '',
         password: '',
         loginError: false,
         validation: this.validator.valid()
      };

      this.submitted = false;
      this.changeStates = false;
      this.handleChange = this.handleChange.bind(this);
      this.handleLogin = this.handleLogin.bind(this);
      this.changeState = this.changeState.bind(this);
   }

   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            this.setState({ redirect: true })
         } else {
            this.setState({ redirect: false })
         }
      })
   }

   componentWillUnmount(){
      this.removeAuthListener();
   }

   handleChange(event) {
      const name = event.target.name;
      const value = event.target.value;
      this.setState({ [name]: value });
      console.table([{
         email: this.state.email,
         password: this.state.password,
         redirect: this.state.redirect
      }])
   }

   handleLogin(event) {
      event.preventDefault()

      var errorCode = null;
      const validation = this.validator.validate(this.state);
      this.setState({validation});
      this.submitted = true;

      if (validation.isValid) {
         app.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            errorCode = error.code;
            var errorMessage = error.message;
         })
         this.changeStates = true;
      }

      console.table([{
         email: this.state.email,
         password: this.state.password,
         redirect: this.state.redirect
      }])
   }

   changeState() {
      this.setState({loginError: true})
   }

   render() {
      let validation = this.submitted ?
         this.validator.validate(this.state) :
         this.state.validation;

      if(this.state.redirect) {
         return <Redirect to='/loading'/>
      }

      var loginError = this.state.loginError;
      console.log(loginError);

      return (
         <div id="login_div">
            <form onSubmit={this.handleLogin}>
               {this.changeStates ? (
                  <div id="login_error">
                     <p>Email or password was not valid.</p>
                  </div>
               ) : ( null ) }
               <div className={validation.email.isInvalid && 'has-error'} id="input_div">
                  <input id="login-email"
                         className="form-control"
                         type="email"
                         name="email"
                         placeholder="Email"
                         value={this.state.email}
                         onChange={this.handleChange} required/>
                  <span id="help-block-1">{validation.email.message}</span>
               </div>
               <div className={validation.password.isInvalid && 'has-error'} id="input_div">
                  <input id="login-password"
                         className="form-control"
                         type="password"
                         name="password"
                         placeholder="Password"
                         value={this.state.password}
                         onChange={this.handleChange} required/>
                  <span id="help-block-2">{validation.password.message}</span>
               </div>
               <br/>
               <input id="login-submit" type="submit" value="Log In"></input>
            </form>
         </div>
      )
   }
}