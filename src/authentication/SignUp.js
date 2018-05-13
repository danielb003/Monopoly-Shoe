import React, { Component } from 'react';
import './SignUp.css';
import { Redirect } from 'react-router-dom'
import { app } from '../Constant'
import FormValidator from "./FormValidator";

export default class SignUp extends Component {
   constructor(props) {
      super(props);

      this.validator = new FormValidator([
         {
            field: 'fname',
            method: 'isEmpty',
            validWhen: false,
            message: 'First name is required.'
         },
         {
            field: 'fname',
            method: 'matches',
            args: [/(^[A-Za-z\'\,\-]{2,}$)/],
            validWhen: true,
            message: 'First name is not valid'
         },
         {
            field: 'lname',
            method: 'isEmpty',
            validWhen: false,
            message: 'Last name is required.'
         },
         {
            field: 'lname',
            method: 'matches',
            args: [/(^[A-Za-z\'\,\-]{2,}$)/],
            validWhen: true,
            message: 'Last name is not valid'
         },
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
            args: [/(?:[^\/\\\.\,\+\=\~]{9,})/],
            validWhen: true,
            message: 'Password must be 9 or more characters'
         }
      ]);

      this.state = {
         redirect: false,
         fname: '',
         lname: '',
         email: '',
         password: '',
         admin: false,
         pushID: null,
         validation: this.validator.valid()
      };

      this.submitted = false;
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

      app.auth().onAuthStateChanged((user) => {
         if(user){
            var authData = app.auth().currentUser;
            if (authData) {
               console.log(authData.uid);
            }
            var uid = authData.uid;
            const user = app.database().ref('user/' + this.state.pushID);
            user.on('value', (snapshot) => {
               if (snapshot.val() !== null) {

                  user.remove();
                  app.database().ref('user/' + uid).set({
                     fname: this.state.fname,
                     lname: this.state.lname,
                     email: this.state.email,
                     password: this.state.password,
                     admin: this.state.admin,
                     trading: false
                  });
                  app.database().ref('user/' + uid + '/coin').set({
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
      event.preventDefault();

      const validation = this.validator.validate(this.state);
      this.setState({validation});
      this.submitted = true;

      if (validation.isValid) {
         app.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
               alert('The password is too weak.');
            } else {
               alert(errorMessage);
            }
            console.log(error);
         })
      }

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
      });
      app.database().ref().child('user').child(push_id).set(user);

   }

   render() {
      let validation = this.submitted ?
         this.validator.validate(this.state) :
         this.state.validation;

      if(this.state.redirect) {
         return <Redirect to='/dashboard'/>
      }

      return (
         <div id="signup_div">
            <form onSubmit={this.handleSignUp}>
               <div className={validation.fname.isInvalid && 'has-error'} id="input_div">
                  <input id="firstname"
                         type="text"
                         name="fname"
                         placeholder="Enter first name"
                         value={this.state.fname}
                         onChange={this.handleChange} required/>
                  <span id="help-block-1">{validation.fname.message}</span>
               </div>
               <div className={validation.lname.isInvalid && 'has-error'} id="input_div">
                  <input id="lastname"
                         type="text"
                         name="lname"
                         placeholder="Enter last name"
                         value={this.state.lname}
                         onChange={this.handleChange} required/>
                  <span id="help-block-1">{validation.lname.message}</span>
               </div>
               <div className={validation.email.isInvalid && 'has-error'} id="input_div">
                  <input id="email"
                         type="email"
                         name="email"
                         placeholder="Enter email"
                         value={this.state.email}
                         onChange={this.handleChange} required/>
                  <span id="help-block-1">{validation.email.message}</span>
               </div>
               <div className={validation.password.isInvalid && 'has-error'} id="input_div">
                  <input id="password"
                         type="password"
                         name="password"
                         placeholder="Enter password"
                         value={this.state.password}
                         onChange={this.handleChange} required/>
                  <span id="help-block-1">{validation.password.message}</span>
               </div>
               <input id="submit" type="submit" value="Sign Up"></input>
            </form>
         </div>
      )
   }
}