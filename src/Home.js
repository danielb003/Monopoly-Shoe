import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import CryptoChart from './graph/CryptoChart';
import Transaction from './graph/Transaction';
/*import './Home.css';*/

export default class Home extends Component {
   state = {
      type: null
   }

    render() {
        return (
           <div>
              <Navbar inverse>
                 <Nav>
                    <NavItem>
                       <p>Monopoly Shoe</p>
                    </NavItem>
                    <NavItem eventKey={1} href="/Dashboard">
                       Portfolio
                    </NavItem>
                 </Nav>
                 <Nav pullRight>
                    <NavItem eventKey={2} href="/auth">
                       Login
                    </NavItem>
                 </Nav>
              </Navbar>
              <div className='crypto_chart'>
                 <CryptoChart />
                 <Transaction />
              </div>
           </div>
        )
    }
}