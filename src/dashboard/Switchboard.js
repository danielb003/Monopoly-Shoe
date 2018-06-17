/*
Switchboard Page
Author: Daniel Bellino
Date: 16/06/2018
*/
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { app } from '../Constant';

export default class Switchboard extends Component {
   constructor(props) {
      super(props)
      this.state = {
         adminStatus: null
      }
   }

   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            var user_id, admin = false;
            user_id = user.uid;
            const userData = app.database().ref('user/' + user_id);
            userData.on('value', (snapshot) => {
               if(snapshot.val() !== null) {
                  console.log('admin: ' + snapshot.child('admin').val());
                  admin = snapshot.child('admin').val();

                  this.setState({
                     adminStatus: admin,
                  });
               }
            });
         }
      })
   }

   componentWillUnmount() {
      this.removeAuthListener();
   }

   render() {
      const adminStatus = this.state.adminStatus;

      if(adminStatus === true) {
         return <Redirect to="/admin" />
      } else if(adminStatus === false) {
         return <Redirect to="/dashboard"/>
      }

      return (
         <div style={{ textAlign: "center", position: "absolute", top: "25%", left: "50%" }}>
            <h3 style={{ color: "rgb(220,220,220" }}>Logging In...</h3>
         </div>
      )
   }
}