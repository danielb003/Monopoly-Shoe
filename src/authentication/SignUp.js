import React, { Component } from 'react';
import './SignUp.css';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'

export default class SignUp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         redirect: false,
         email: '',
         password: ''
      }
      this.handleSignUp = this.handleSignUp.bind(this);
   }

   /*handleChange(e) {
      this.setState({
         fname: e.target.fname,
         lname: e.target.lname,
         email: e.target.email,
         password: e.target.password
      });
   }*/

   handleSignUp(event, email, password) {
      event.preventDefault()

      const user = {};
      user['user/' + this.state.userId] = {
         fname: this.fnameInput.value,
         lname: this.lnameInput.value,
         email: this.emailInput.value,
         password: this.passwordInput.value
      };

      var extras = {
         fname: this.fnameInput.value,
         lname: this.lnameInput.value
      };

      email = this.emailInput.value;
      password = this.passwordInput.value;

      app.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
         if(errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
         } else {
            alert(errorMessage);
         }
         console.log(error);
      }).then(this.setState({ redirect: true}))

      console.table([{
         fname: this.fnameInput.value,
         lname: this.lnameInput.value,
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
         <div id="signup_div">
            <form onSubmit={(event) => { this.handleSignUp(event) }} ref={(form) => { this.loginForm = form }}>
               <input id="firstname" type="text" name="fname" placeholder="Enter first name" ref={(input) => { this.fnameInput = input }}></input>
               <input id="lastname" type="text" name="lname" placeholder="Enter last name" ref={(input) => { this.lnameInput = input }}></input>
               <input id="email" type="email" name="email" placeholder="Enter email" ref={(input) => { this.emailInput = input }}></input>
               <input id="password" type="password" name="password" placeholder="Enter password" ref={(input) => { this.passwordInput = input }}></input>
               <input id="submit" type="submit" value="Sign Up"></input>
            </form>
         </div>
      )
   }
}