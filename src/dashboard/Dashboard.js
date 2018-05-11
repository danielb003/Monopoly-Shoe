import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import './../App.css';
import './Dashboard.css';
import profile_img from './../img/profile-img.png';
import bitcoin_icon from './../img/bitcoin_icon.png';
import ethereum_icon from './../img/ethereum_icon.png';
import litecoin_icon from './../img/litecoin_icon.png';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import { app } from '../Constant';
import CryptoChart from '../graph/CryptoChart';
import firebase from 'firebase';
import TextField from 'material-ui/TextField';


class Dashboard extends Component {
   constructor(props) {
      super(props);

      this.state = {
         authenticated: true,
         openTradingAccount: null,
          uid: null,
          history:[],
          startDate:null,
          endDate:null,
          user_data: [],
          open_buy_orders: [],
          open_sell_orders: [],
          coins:[]
      };

      this.handleSwitchChange = this.handleSwitchChange.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
       this.startDateChange = this.startDateChange.bind(this);
       this.endDateChange = this.endDateChange.bind(this);

   }

   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            this.setState({ authenticated: true })
         } else {
            this.setState({ authenticated: false })
         }
      });

   }

   componentDidMount(){
       this.loadUserIDAndTradingStatus();
       this.retrieve_history();
       this.retrieve_userData();
       this.retrieve_coins();
       this.retrieve_open_buy_orders();
       this.retrieve_open_sell_orders();
   }

   componentWillUnmount(){
      this.removeAuthListener();

   }

    loadUserIDAndTradingStatus = () => {
        var user_id = null;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user_id = user.uid;
                this.setState({
                    uid : user_id
                })
                const userDB = firebase.database().ref('user/' + user_id);
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

    handleSwitchChange = event => {
        this.setState({
            openTradingAccount: event.target.checked
        }, () =>{
            this.updateTrading();
        });

    }

    updateTrading = () => {
        console.log('trading status in handle change ' + this.state.openTradingAccount);
        firebase.database().ref('user/' + this.state.uid + '/').update({
            trading: this.state.openTradingAccount
        });
    }

    retrieve_history = () => {

        const assignedHistory = [];
        const historyFB = firebase.database().ref('history/');
        historyFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){

                for(const index in snapshot.val()) {
                    if (snapshot.child(index + "/user_id").val() == firebase.auth().currentUser.uid) {
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

    retrieve_userData = () => {
        var user_id = null;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user_id = user.uid;
                const user_details = [];
                const userData = firebase.database().ref('user/' + user_id);
                userData.on('value', (snapshot) => {
                    if(snapshot.val() !== null) {
                        console.log('admin: ' + snapshot.child('admin').val());
                        user_details.push({
                            admin: snapshot.child('admin').val(),
                            coin: snapshot.child('coin').val(),
                            email: snapshot.child('email').val(),
                            fname: snapshot.child('fname').val(),
                            lname: snapshot.child('lname').val(),
                            trading: snapshot.child('trading').val()
                        });
                        this.setState({
                            user_data: user_details[0]
                        });
                    }
                });
            }
        });
    }

    retrieve_coins = () => {

        var user_id = null;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user_id = user.uid;
                const assignedCoins = [];
                const coinsFb = firebase.database().ref('user/' + user_id +'/coin');
                coinsFb.on('value', (snapshot) => {
                    if(snapshot.val() !== null) {
                        let items = snapshot.val();
                        for (let key in items) {
                            if( snapshot.child(key).val()>0 && key!="balance") {
                                assignedCoins.push({
                                    name: key,
                                    amt: snapshot.child(key).val()
                                });
                            }
                        }
                        this.setState({
                            coins: assignedCoins
                        });
                    }
                });
            }
        });
    }

    retrieve_open_buy_orders = () => {

        const assignedOpenBuys = [];
        const openBuyFB = firebase.database().ref('buy/');
        openBuyFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){

                for(const index in snapshot.val()) {
                    if (snapshot.child(index + "/user_id").val() == firebase.auth().currentUser.uid) {
                        assignedOpenBuys.push({
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
                    open_buy_orders: assignedOpenBuys
                });
            }
        });
    }

    retrieve_open_sell_orders = () => {

        const assignedOpenSells = [];
        const openSellFB = firebase.database().ref('sell/');
        openSellFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){

                for(const index in snapshot.val()) {
                    if (snapshot.child(index + "/user_id").val() == firebase.auth().currentUser.uid) {
                        assignedOpenSells.push({
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
                    open_sell_orders: assignedOpenSells
                });
            }
        });
    }


    handleSubmit(event) {
        event.preventDefault();
        var moment = require('moment');
        var momentStartDate=moment(this.state.startDate);
        var momentEndDate=moment(this.state.endDate);

        const assignedFilHistory = [];
        const historyFB = firebase.database().ref('history/');
        historyFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){

                for(const index in snapshot.val()) {
                    if (snapshot.child(index + "/user_id").val() == firebase.auth().currentUser.uid) {
                        var historyDate = snapshot.child(index + "/timestamp").val();
                        historyDate = historyDate.substring(0, 10);
                        var momentDate = moment(historyDate);
                        if(moment(momentDate).isBetween(momentStartDate,momentEndDate,null, '[]')) {

                            assignedFilHistory.push({
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
                }
                this.setState({
                    history: assignedFilHistory
                }, () => {
                    console.log(assignedFilHistory)
                });
            }
        });

    }

    startDateChange(event){
        this.setState({
            startDate: event.target.value
        });

    }
    endDateChange(event){
        this.setState({
            endDate: event.target.value
        });
    }


   render(){
      if(this.state.authenticated === false) {
         return <Redirect to='/'/>
      }

      const historyState = this.state.history;
      const tradingStatus = this.state.openTradingAccount;
      console.log('trading status ' + tradingStatus);
      const { startDate,endDate, user_data } = this.state;

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

      const openBuyOrdersState = this.state.open_buy_orders;

      const openBuyTableData = openBuyOrdersState ? (
          this.state.open_buy_orders.map(function(item){
          return (
              <tbody>
              <tr key={item.id}>
                  <td>{item.timestamp.substring(0, 10)}</td>
                  <td>{item.coinType}</td>
                  <td>{item.price}</td>
                  <td>{item.amount}</td>
                  <td>{item.coinValue}</td>
              </tr>
              </tbody>
          )
      })) : (
          null
      );

      const openSellOrdersState = this.state.open_sell_orders;

      const openSellTableData = openSellOrdersState ? (
          this.state.open_sell_orders.map(function(item){
          return (
              <tbody>
              <tr key={item.id}>
                  <td>{item.timestamp.substring(0, 10)}</td>
                  <td>{item.coinType}</td>
                  <td>{item.price}</td>
                  <td>{item.amount}</td>
                  <td>{item.coinValue}</td>
              </tr>
              </tbody>
          )
      })) : (
          null
      );

       const coinState = this.state.coins;

       const coinTableData = coinState ? (
           this.state.coins.map(function(item){
               return (
                   <tbody>
                   <tr key={item.name}>
                       <td>{item.name}</td>
                       <td>{item.amt}</td>
                   </tr>
                   </tbody>
               )
           })) : (
           null
       );


      //  const userData = this.state.user_data;
      // const portfolioTable = userData ? (
      //     this.state.user_data.map(function(item){
      //         return (
      //             <tbody>
      //             <tr key={item.id}>
      //                 {/*<td>{item.image}</td>*/}
      //                 {/*<td>{item.totalBalance}</td>*/}
      //                 {/*<td>{item.availableBalance}</td>*/}
      //                 {/*<td>{item.BTC value}</td>*/}
      //             </tr>
      //             </tbody>
      //         )
      // })) : ( null );

      return (
            <div>
               <Navbar inverse>
                  <Nav id="nav_box">
                     <NavItem class="nav_item" href="/">
                        <p>Prolific Trading</p>
                     </NavItem>
                     <NavItem class="nav_item" eventKey={1} href="/dashboard">
                        Portfolio
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
                           <strong>Trading Account</strong>
                           <div>
                              <Switch
                                  checked={tradingStatus == true ? true : false}
                                  onChange={this.handleSwitchChange}
                                  color="primary"
                              />
                           </div>
                        </div>
                     </div>



                     <div className="col-md-9 noPad">
                        <div className="text-center"><h1 id="dashboard" className="display-4">DASHBOARD</h1></div>
                        <div className="container col-md-12 noPad">


                           <div className="container-fluid noPad">
                              <h4 id="heading" className="pull-left">Portfolio</h4>


                               <table className="table table-bordered">
                                   {this.state.coins ? (<thead className="">
                                   <tr>
                                       <th>Coin</th>
                                       <th>Amount</th>
                                       <th>Average Price</th>
                                   </tr>
                                   </thead>) : null}
                                   {coinTableData}
                               </table>

                           </div>
                          
                           <div className="container-fluid noPad">
                              <h4 id="heading" className="pull-left">Open Buy Orders</h4>

                                 <table className="table table-bordered">
                                   {this.state.open_buy_orders ? (<thead className="">
                                   <tr>
                                       <th>Date</th>
                                       <th>Coin</th>
                                       <th>Price</th>
                                       <th>Amount</th>
                                       <th>Value</th>
                                   </tr>
                                   </thead>) : null}
                                   {openBuyTableData}
                               </table>
                            </div>
  
                            <div className="container-fluid noPad">
                              <h4 id="heading" className="pull-left">Open Sell Orders</h4>

                                 <table className="table table-bordered">
                                   {this.state.open_sell_orders ? (<thead className="">
                                   <tr>
                                       <th>Date</th>
                                       <th>Coin</th>
                                       <th>Price</th>
                                       <th>Amount</th>
                                       <th>Value</th>
                                   </tr>
                                   </thead>) : null}
                                   {openSellTableData}
                               </table>
                            </div>


                           <div className="container-fluid noPad">
                              <h4 id="heading" className="pull-left">Transaction History</h4>

                               <div className="col-md-12 white-bg table-bordered">
                                   <form id="filter" onSubmit={this.handleSubmit} noValidate>
                                       <div className="col-md-3">
                                           <h4>Start Date</h4>
                                           <TextField
                                               id="startDate"
                                               value={this.state.startDate}
                                               onChange={this.startDateChange}
                                               type="date"
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                           />
                                       </div>
                                       <div className="col-md-3">
                                           <h4>End Date</h4>
                                           <TextField
                                               id="endDate"
                                               // label="End Date"
                                               value={this.state.endDate}
                                               onChange={this.endDateChange}
                                               type="date"
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                           />
                                       </div>
                                       <div className="filter">
                                           <Button id="filter-button" color="primary" type="submit" >
                                           <p>Filter</p>
                                           </Button>
                                           <Button id="clearFilter-button" color="primary" type="button" onClick={this.retrieve_history} >
                                               <p>Clear</p>
                                           </Button>
                                       </div>

                                   </form>
                               </div>

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
      );
   }

}

export default Dashboard;