import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import CryptoChart from './graph/CryptoChart';
import Transaction from './graph/Transaction';
import { app } from "./Constant";
import './Home.css';
import firebase from "firebase";


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

    loadTradingStatus = () => {
        var user_id = null;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user_id = user.uid;
                const userDB = firebase.database().ref('user/' + user_id);
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
                 <Nav>
                    <NavItem class="nav_item">
                       <p>Monopoly Shoe</p>
                    </NavItem>
                    <NavItem class="nav_item" eventKey={1} href="/dashboard">
                       Portfolio
                    </NavItem>
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