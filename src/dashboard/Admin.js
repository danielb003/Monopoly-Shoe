import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
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
      this.retrieveUserData();
      this.retrieveAllUsers();
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

   retrieveUserData() {
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

   retrieveAllUsers() {
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

   retrieveHistory(fname, lname){
      console.log(fname);
      console.log(lname);
      var user_id;
      const userFB = app.database().ref('user/');
      userFB.on('value', (snapshot) => {
         if(snapshot.val() !== null) {

            for(const index in snapshot.val()) {
               if(snapshot.child(index + "/fname").val() === fname && snapshot.child(index + "/lname").val() == lname) {
                  user_id = index;
                  console.log(user_id);
               }
            }
         }
      })

      const assignedHistory = [];
      const historyFB = app.database().ref('history/');
      historyFB.on('value', (snapshot) => {
         if(snapshot.val() !== null){

            for(const index in snapshot.val()) {
               if (snapshot.child(index + "/user_id").val() === user_id) {
                  assignedHistory.push({
                     id: index,
                     amount: snapshot.child(index + "/amount").val(),
                     coinType: snapshot.child(index + "/coinType").val(),
                     type: snapshot.child(index + "/type").val(),
                     price: snapshot.child(index + "/price").val(),
                     user_id: snapshot.child(index + "/user_id").val(),
                     timestamp: snapshot.child(index + "/timestamp").val(),
                     coinValue: snapshot.child(index + "/coinValue").val()
                  });
               }
            }

            this.setState({
               history: assignedHistory
            });
         }
      });
   }

   render() {
      const tradingStatus = this.state.openTradingAccount;
      const { user_data } = this.state;

      const historyState = this.state.history;
      const historyTableData = historyState ? (
         this.state.history.map(function(item){
            return (
               <tbody>
               <tr key={item.id}>
                  <td>{item.timestamp.substring(0, 10)}</td>
                  <td>{item.coinType}</td>
                  <td>{item.type}</td>
                  <td>{item.price}</td>
                  <td>{item.amount}</td>
                  <td>{item.coinValue}</td>
               </tr>
               </tbody>
            )
         })) : (
         null
      );

      const userState = this.state.all_users;
      const userTableData = userState ? (
         this.state.all_users.map((item) => {
            return (
               <tbody>
               <tr key={item.id} id="table_row">
                  <td onClick={() => this.retrieveHistory(item.fname, item.lname)}>{item.fname}</td>
                  <td onClick={() => this.retrieveHistory(item.fname, item.lname)}>{item.lname}</td>
                  <td id="edit_header"><a href={"https://console.firebase.google.com/u/0/project/pp1-project-5de58/authentication/users"} target="_blank">Go</a></td>
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
                                 <th>Edit User</th>
                              </tr>
                              </thead>) : null}
                              {userTableData}
                           </table>

                        </div>

                        <div className="container-fluid noPad">
                           <h4 id="heading" className="pull-left">User History</h4>

                           <table className="table table-bordered">
                              {this.state.history ? (<thead className="">
                              <tr>
                                 <th>Date</th>
                                 <th>Coin</th>
                                 <th>Type</th>
                                 <th>Price</th>
                                 <th>Amount</th>
                                 <th>Value</th>
                              </tr>
                              </thead>) : null}
                              {historyTableData}
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