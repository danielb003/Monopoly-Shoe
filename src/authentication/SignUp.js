import React, { Component } from 'react';
import './SignUp.css';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'

export default class SignUp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         redirect: false,
         fname: '',
         lname: '',
         email: '',
         password: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSignUp = this.handleSignUp.bind(this);
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
         fname: this.state.fname,
         lname: this.state.lname,
         email: this.state.email,
         password: this.state.password,
         redirect: this.state.redirect
      }])
   }

   handleSignUp(event) {
      event.preventDefault()

      app.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
         if(errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
         } else {
            alert(errorMessage);
         }
         console.log(error);
      })

      const user2 = {};
      user2['user/' + this.state.uid] = {
         fname: this.state.fname,
         lname: this.state.lname,
         email: this.state.email,
         password: this.state.password
      };

      console.table([{
         fname: this.state.fname,
         lname: this.state.lname,
         email: this.state.email,
         password: this.state.password,
         redirect: this.state.redirect
      }])

      var user = app.auth().currentUser;
      var uid, email, password;

      if(user != null) {
         uid = user.uid;
         email = user.email;
         password = user.password;
      }

      app.database().ref('user/' + uid).set({
         fname: this.state.fname,
         lname: this.state.lname,
         email: email,
         password: password
      });
   }

   render() {
      if(this.state.redirect) {
         return <Redirect to='/dashboard'/>
      }

      return (
         <div id="signup_div">
            <form onSubmit={this.handleSignUp}>
               <input id="firstname" type="text" name="fname" placeholder="Enter first name" value={this.state.fname} onChange={this.handleChange} required></input>
               <input id="lastname" type="text" name="lname" placeholder="Enter last name" value={this.state.lname} onChange={this.handleChange} required></input>
               <input id="email" type="email" name="email" placeholder="Enter email" value={this.state.email} onChange={this.handleChange} required></input>
               <input id="password" type="password" name="password" placeholder="Enter password" value={this.state.password} onChange={this.handleChange} required></input>
               <input id="submit" type="submit" value="Sign Up"></input>
            </form>
         </div>
      )
   }
}