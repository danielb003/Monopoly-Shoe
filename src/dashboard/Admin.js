import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import './Admin.css';
import profile_img from './../img/profile-img.png';
import Switch from 'material-ui/Switch';
import { app } from "../Constant";

export default class Admin extends Component {
   constructor(props) {
      super(props);

      this.state = {
         authenticated: true,
         openTradingAccount: null,
         uid: null,
         user_data: [],
         all_users: []
      };

   }

   componentDidMount(){
      this.loadUserIDAndTradingStatus();
      this.retrieve_userData();
      this.retrieve_all_users();
      this.expandTable();
   }

   loadUserIDAndTradingStatus() {
      var user_id = null;
      app.auth().onAuthStateChanged((user) => {
         if (user) {
            user_id = user.uid;
            this.setState({
               uid : user_id
            })
            const userDB = app.database().ref('user/' + user_id);
            var trading = null;
            userDB.on('value', (snapshot) => {

               if (snapshot.val() !== null) {
                  trading = snapshot.child("/trading").val();
               }
               // console.log('load trading : ' + trading);
               this.setState({
                  openTradingAccount: trading
               }, () => {
                  console.log('load trading : ' + this.state.openTradingAccount);
               });
            });
         }
      });
   }

   retrieve_userData() {
      var user_id = null, admin = false;
      app.auth().onAuthStateChanged((user) => {
         if (user) {
            user_id = user.uid;
            const user_details = [];
            const userData = app.database().ref('user/' + user_id);
            userData.on('value', (snapshot) => {
               if(snapshot.val() !== null) {
                  console.log('admin: ' + snapshot.child('admin').val());
                  admin = snapshot.child('admin').val();
                  user_details.push({
                     admin: snapshot.child('admin').val(),
                     coin: snapshot.child('coin').val(),
                     email: snapshot.child('email').val(),
                     fname: snapshot.child('fname').val(),
                     lname: snapshot.child('lname').val(),
                     trading: snapshot.child('trading').val()
                  });

                  this.setState({
                     user_data: user_details[0],
                     adminStatus: admin
                  });
               }
            });
         }
      });
   }

   retrieve_all_users() {
      const assignedUser = [];
      const userFB = app.database().ref('user/');
      userFB.on('value', (snapshot) => {
         if(snapshot.val() !== null){

            for(const index in snapshot.val()) {
               if (snapshot.child(index + '/fname').val()) {
                  assignedUser.push({
                     id: snapshot.child(index).val(),
                     fname: snapshot.child(index + '/fname').val(),
                     lname: snapshot.child(index + '/lname').val()
                  });
               }
            }

            this.setState({
               all_users: assignedUser
            });
         }
      });
   }

   expandTable = () => {
      console.log("expand exists")
   }

   render() {
      const tradingStatus = this.state.openTradingAccount;
      const { user_data } = this.state;

      const userState = this.state.all_users;
      const userTableData = userState ? (
         this.state.all_users.map(function(item){
            return (
               <tbody>
               <tr key={item.fname} id="table_row">
                  <td>{item.fname}</td>
                  <td>{item.lname}</td>
               </tr>
               </tbody>
            )
         })) : (
         null
      );

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
               <div className="row">

                  <div className="col-md-3 noPad_left">
                     <div className="text-center"><h1 className="display-4"> &nbsp;</h1></div>
                     <div className="card center-block noPad_left">
                        <img id="user_profile" src={profile_img } className="center-block img-responsive img-circle" />
                        <h2> {user_data.fname} {user_data.lname}</h2><br/>
                        <strong>{user_data.email} </strong> <br/><br/>
                        {user_data.admin == true && user_data.admin !== null
                           ? (<strong>Admin User</strong>) : (<strong>Regular User</strong>)}
                        <br/><br/>
                     </div>
                  </div>



                  <div className="col-md-9 noPad">
                     <div className="text-center"><h1 id="dashboard" className="display-4">ADMINISTRATOR</h1></div>
                     <div className="container col-md-12 noPad">
                        <div className="container-fluid noPad">
                           <h4 id="heading" className="pull-left">Users</h4>

                           <table className="table table-bordered">
                              {this.state.all_users ? (<thead className="">
                              <tr>
                                 <th>First Name</th>
                                 <th>Last Name</th>
                              </tr>
                              </thead>) : null}
                              {userTableData}
                           </table>

                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }
}