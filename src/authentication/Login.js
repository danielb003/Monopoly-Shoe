import React, { Component } from 'react';
import './Login.css';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'

export default class Login extends Component {
   constructor(props) {
      super(props);

      this.state = {
         redirect: false,
         email: '',
         password: ''
      };

      this.handleLogin = this.handleLogin.bind(this);
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

   handleLogin(event) {
      event.preventDefault()

      var email = this.emailInput.value;
      var password = this.passwordInput.value;
      var loggedIn = false;

      app.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
      })

      console.table([{
         email: this.emailInput.value,
         password: this.passwordInput.value,
         redirect: this.state.redirect
      }])
   }

   render() {
      if(this.state.redirect === true) {
         return <Redirect to='/dashboard'/>
      }

      return (
         <div id="login_div">
            <form onSubmit={(event) => { this.handleLogin(event) }} ref={(form) => { this.loginForm = form }}>
               <input id="login-email" type="email" name="email" placeholder="Email" ref={(input) => { this.emailInput = input }}></input>
               <input id="login-password" type="password" name="password" placeholder="Password" ref={(input) => { this.passwordInput = input }}></input>
               <br/>
               <input id="login-submit" type="submit" value="Log In"></input>
            </form>
         </div>
      )
   }
}