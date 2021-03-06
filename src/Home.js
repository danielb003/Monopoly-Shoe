/*
Home Page
Author: Daniel Bellino, Peter Locarnini, Bryan Soh, Panhaseth Heang
Edited and Refactored By: Daniel Bellino
Date: 17/06/2018
*/

import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import CryptoChart from './graph/CryptoChart';
import { app } from "./Constant";
import './Home.css';

export default class Home extends Component {
   constructor() {
      super();

      this.state = {
         authenticated: false,
         tradingStatus: false,
         adminStatus: false
      };
   }
   /* checks the authentication state to determine what components to display and what
    * the navigation should display
    */
   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            this.setState({ authenticated : true })
         } else {
            this.setState({ authenticated: false })
         }
      });
      this.loadTradingAdminStatus();
   }

   componentWillUnmount() {
      this.removeAuthListener()
   }
   /* method to check the loading and admin status */
   loadTradingAdminStatus() {
      var user_id = null;
      app.auth().onAuthStateChanged((user) => {
         if (user) {
            user_id = user.uid;
            const userDB = app.database().ref('user/' + user_id);
            var trading = null, admin = null;
            userDB.on('value', (snapshot) => {
               if (snapshot.val() !== null) {
                  trading = snapshot.child("/trading").val();
                  admin = snapshot.child("/admin").val();
               }
               this.setState({
                  tradingStatus: trading,
                  adminStatus: admin
               });
            });
         }
      });
   }

   render() {
      return (
         <div>
            <Navbar inverse>
               <Nav id="nav_box">
                  <NavItem className="nav_item">
                     <p>Prolific Trading</p>
                  </NavItem>
                  {this.state.authenticated && !this.state.adminStatus ? (
                     <NavItem className="nav_item" eventKey={1} href="/dashboard">
                        Portfolio
                     </NavItem>
                  ) : this.state.authenticated && this.state.adminStatus ? (
                     <NavItem className="nav_item" eventKey={1} href="/admin">
                        Admin
                     </NavItem>
                  ) : !this.state.authenticated && !this.state.adminStatus ? (
                     <NavItem className="nav_item" eventKey={1} href="/">
                        Market
                     </NavItem>
                  ) : null }
                  <NavItem className="nav_item" eventKey={2} href="/leaderboard">
                     Leaderboard
                  </NavItem>
               </Nav>
               <Nav pullRight>
                  {this.state.authenticated ? (
                     <NavItem className="nav_item" eventKey={2} href="/logout">
                        Logout
                     </NavItem> ) : (
                     <NavItem className="nav_item" eventKey={2} href="/auth">
                        Login
                     </NavItem> )
                  }
               </Nav>
            </Navbar>
            {this.state.authenticated && this.state.tradingStatus && !this.state.adminStatus ? (
               <div className='crypto_chart'>
                  <CryptoChart auth={true}/>
               </div> ) : (
               <div className='crypto_chart'>
                  <CryptoChart />
               </div> ) }
         </div>
      )
   }
}