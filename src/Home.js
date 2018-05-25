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
         tradingStatus: false
      };
   }

   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            this.setState({ authenticated : true })
         } else {
            this.setState({ authenticated: false })
         }
      });
      this.loadTradingStatus();
   }

   componentWillUnmount() {
      this.removeAuthListener()
   }

   loadTradingStatus() {
      var user_id = null;
      app.auth().onAuthStateChanged((user) => {
         if (user) {
            user_id = user.uid;
            const userDB = app.database().ref('user/' + user_id);
            var trading = null;
            userDB.on('value', (snapshot) => {
               if (snapshot.val() !== null) {
                  trading = snapshot.child("/trading").val();
               }
               this.setState({
                  tradingStatus: trading
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
                  <NavItem class="nav_item">
                     <p>Prolific Trading</p>
                  </NavItem>
                  {this.state.authenticated && this.state.tradingStatus ? (
                     <NavItem class="nav_item" eventKey={1} href="/dashboard">
                        Portfolio
                     </NavItem>
                  ) : this.state.authenticated && !this.state.tradingStatus ? (
                     <NavItem class="nav_item" eventKey={1} href="/admin">
                        Admin
                     </NavItem>
                  ) : !this.state.authenticated && !this.state.tradingStatus ? (
                     <NavItem class="nav_item" eventKey={1} href="/">
                        Market
                     </NavItem>
                  ) : null }
                  <NavItem class="nav_item" eventKey={2} href="/leaderboard">
                     Leaderboard
                  </NavItem>
               </Nav>
               <Nav pullRight>
                  {this.state.authenticated ? (
                     <NavItem class="nav_item" eventKey={2} href="/logout">
                        Logout
                     </NavItem> ) : (
                     <NavItem class="nav_item" eventKey={2} href="/auth">
                        Login
                     </NavItem> )
                  }
               </Nav>
            </Navbar>
            {this.state.authenticated && this.state.tradingStatus ? (
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