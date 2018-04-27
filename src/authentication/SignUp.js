import React, { Component } from 'react';
import './SignUp.css';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'
import firebase from 'firebase';

export default class SignUp extends Component {
   constructor(props) {
      super(props);
      this.state = {
         redirect: false,
         fname: '',
         lname: '',
         email: '',
         password: '',
         admin: false,
          pushID: null
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
      });
   }

   componentWillUnmount() {
       this.removeAuthListener();

       var uid = firebase.auth().currentUser.uid;
       console.log('uid= ' + uid);
       const user = firebase.database().ref('user/' + this.state.pushID);
       user.on('value', (snapshot) => {
           if (snapshot.val() !== null) {

              user.remove();
               firebase.database().ref('user/' + uid).set({
                     fname: this.state.fname,
                     lname: this.state.lname,
                     email: this.state.email,
                     password: this.state.password,
                     admin: this.state.admin,
                     trading: false
               });
               firebase.database().ref('user/' + uid + '/coin').set({
                   BTC: 0,
                   EOS: 0,
                   ETH: 0,
                   LTC: 0,
                   NEO: 0,
                   NULS: 0,
                   XMR: 0,
                   XRP: 0,
                   balance: 1000000
               });

           }
       });
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

      console.table([{
         fname: this.state.fname,
         lname: this.state.lname,
         email: this.state.email,
         password: this.state.password,
         redirect: this.state.redirect
      }])

       const usersRef = app.database().ref('user');

      const user = {
         fname: this.state.fname,
         lname: this.state.lname,
         email: this.state.email,
         password: this.state.password,
         admin: this.state.admin,
          trading: false
      }

      // set user's uid as push key
      var push_id = usersRef.push(user).key;
      this.setState({
          pushID: push_id
      })
      firebase.database().ref().child('user').child(push_id).set(user);

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