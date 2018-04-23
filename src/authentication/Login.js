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
      this.handleChange = this.handleChange.bind(this);
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

      var loggedIn = false;

      app.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
      })

      console.table([{
         email: this.state.email,
         password: this.state.password,
         redirect: this.state.redirect
      }])
   }

   render() {
      if(this.state.redirect) {
         return <Redirect to='/dashboard'/>
      }

      return (
         <div id="login_div">
            <form onSubmit={this.handleLogin}>
               <input id="login-email" type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} required></input>
               <input id="login-password" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} required></input>
               <br/>
               <input id="login-submit" type="submit" value="Log In"></input>
            </form>
         </div>
      )
   }
}