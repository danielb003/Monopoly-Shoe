import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import './Admin.css';

export default class Admin extends Component {
   constructor(props) {
      super(props);

   }

   render() {
      return (
         <div>
            <Navbar inverse>
               <Nav id="nav_box">
                  <NavItem class="nav_item" href="/">
                     <p>Prolific Trading</p>
                  </NavItem>
                  <NavItem class="nav_item" eventKey={1} href="/">
                     Market
                  </NavItem>
                  <NavItem class="nav_item" eventKey={2} href="/leaderboard">
                     Leaderboard
                  </NavItem>
               </Nav>
               <Nav pullRight>
                  <NavItem class="nav_item" eventKey={2} href="/logout">
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