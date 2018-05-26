import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Admin.css';

export default class Admin extends Component {
   render() {
      return (
         <div>
            <Navbar inverse>
               <Nav id="nav_box">
                  <NavItem className="nav_item" href="/">
                     <p>Prolific Trading</p>
                  </NavItem>
                  <NavItem className="nav_item" eventKey={1} href="/">
                     Market
                  </NavItem>
                  <NavItem className="nav_item" eventKey={2} href="/leaderboard">
                     Leaderboard
                  </NavItem>
               </Nav>
               <Nav pullRight>
                  <NavItem className="nav_item" eventKey={2} href="/logout">
                     Logout
                  </NavItem>
               </Nav>
            </Navbar>

            <div className="container ">

            </div>
         </div>
      )
   }

}