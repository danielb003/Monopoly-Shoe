import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import CryptoChart from './graph/CryptoChart';
import Transaction from './graph/Transaction';
import { app } from "./Constant";
import './Home.css';


export default class Home extends Component {
   constructor() {
      super();

      this.state = {
         authenticated: false,
      };
   }

   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            this.setState({ authenticated : true })
         } else {
            this.setState({ authenticated: false })
         }
      })
   }

   componentWillUnmount() {
      this.removeAuthListener()
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
              {this.state.authenticated ? (
              <div className='crypto_chart'>
                 <CryptoChart auth={true}/>
                 {/*<Transaction />*/}
              </div> ) : (
                 <div className='crypto_chart'>
                    <CryptoChart />
                 </div> ) }
           </div>
        )
    }
}