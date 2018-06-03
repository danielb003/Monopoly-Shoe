import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './../App.css';
import './Dashboard.css';
import profile_img from './../img/profile-img.png';
import bitcoin_icon from './../img/bitcoin_icon.png';
import ethereum_icon from './../img/ethereum_icon.png';
import litecoin_icon from './../img/litecoin_icon.png';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import { app } from '../Constant';
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
          coins:[],
          open_buy_orders: [],
          open_sell_orders: [],
          pairs: [{name: "BTC"},{name: "LTC"},{name: "ETH"},{name: "NULS"},{name: "XRP"},{name: "XMR"},{name: "NEO"},{name: "EOS"}],
      }

      this.handleSwitchChange = this.handleSwitchChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.startDateChange = this.startDateChange.bind(this);
      this.endDateChange = this.endDateChange.bind(this);
      this.retrieve_open_buy_orders = this.retrieve_open_buy_orders.bind(this);
      this.retrieve_open_sell_orders = this.retrieve_open_sell_orders.bind(this);
      this.loadUserIDAndTradingStatus = this.loadUserIDAndTradingStatus.bind(this);
      this.handleSwitchChange = this.handleSwitchChange.bind(this);
      this.updateTrading = this.updateTrading.bind(this);
      this.retrieve_history = this.retrieve_history.bind(this);
      this.retrieve_userData = this.retrieve_userData.bind(this);
      this.retrieve_coins = this.retrieve_coins.bind(this);
   }

   componentWillMount() {
      this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
         if(user) {
            let user_id, admin = false;
            user_id = user.uid;
            this.setState({ 
                authenticated: true
            })

            const userData = app.database().ref('user/' + user_id);
            userData.on('value', (snapshot) => {
               if(snapshot.val() !== null) {
                  console.log('admin: ' + snapshot.child('admin').val());
                  admin = snapshot.child('admin').val();

                  this.setState({
                     adminStatus: admin
                  });
               }
            });
         } else {
            this.setState({ 
                authenticated: false
            })
         }
      });

   }

   componentDidMount(){
      this.loadUserIDAndTradingStatus();
      this.loadCurrentPrice();
      this.retrieve_history();
      this.retrieve_userData();
      this.retrieve_coins();
      this.retrieve_open_buy_orders();
      this.retrieve_open_sell_orders();
   }

   componentWillUnmount(){
      this.removeAuthListener();

   }

   loadCurrentPrice() {
        app.auth().onAuthStateChanged((user) => {
            if (user) {
                let user_id = user.uid;
                const currentPriceFb = app.database().ref('user/' + user_id + '/coin/current_prices/');
                this.state.pairs.map((pair, index) => {
                    if (pair != undefined)
                    {
                        let currency = "AUD";
                        let url = 'https://min-api.cryptocompare.com/data/price?fsym=' + pair.name + '&tsyms=' + currency;
                        fetch(url).then(r => r.json())
                        .then((coinData) => {
                            currentPriceFb.child(pair.name).set(
                                coinData.AUD
                            );
                        })
                        .catch((e) => {
                        console.log(e);
                        });
                    }
                });
            }
        });
  }
 
   retrieve_open_buy_orders() {
    
      const assignedOpenBuys = [];
      const openBuyFB = app.database().ref('buy/');
      openBuyFB.on('value', (snapshot) => {
         if(snapshot.val() !== null){

            for(const index in snapshot.val()) {
               if (snapshot.child(index + "/user_id").val() == app.auth().currentUser.uid) {
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
    
    retrieve_open_sell_orders() {

        const assignedOpenSells = [];
        const openSellFB = app.database().ref('sell/');
        openSellFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){

                for(const index in snapshot.val()) {
                    if (snapshot.child(index + "/user_id").val() == app.auth().currentUser.uid) {
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

   loadUserIDAndTradingStatus() {
      let user_id = null;
      app.auth().onAuthStateChanged((user) => {
         if (user) {
            user_id = user.uid;
            this.setState({
               uid : user_id
            })
            const userDB = app.database().ref('user/' + user_id);
            let trading = null;
            userDB.on('value', (snapshot) => {

               if (snapshot.val() !== null) {
                  trading = snapshot.child("/trading").val();
               }
               this.setState({
                  openTradingAccount: trading
               }, () => {
                  console.log('load trading : ' + this.state.openTradingAccount);
               });
            });
         }
      });
   }

   handleSwitchChange(event) {
      this.setState({
         openTradingAccount: event.target.checked
      }, () =>{
         this.updateTrading();
      });

   }

   updateTrading() {
      console.log('trading status in handle change ' + this.state.openTradingAccount);
      app.database().ref('user/' + this.state.uid + '/').update({
         trading: this.state.openTradingAccount
      });
   }

   retrieve_history(){

      const assignedHistory = [];
      const historyFB = app.database().ref('history/');
      historyFB.on('value', (snapshot) => {
         if(snapshot.val() !== null){

            for(const index in snapshot.val()) {
               if (snapshot.child(index + "/user_id").val() == app.auth().currentUser.uid) {
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

   retrieve_userData(){
      let user_id = null, admin = false;
      app.auth().onAuthStateChanged((user) => {
         if (user) {
            user_id = user.uid;
            const user_details = [];
            const userData = app.database().ref('user/' + user_id);
            userData.on('value', (snapshot) => {
               if(snapshot.val() !== null) {
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

   retrieve_coins(){
        let user_id = null;
        app.auth().onAuthStateChanged((user) => {
            if (user) {
                user_id = user.uid;
                let assignedCoins = [];
                const user_coin_ref = app.database().ref('user/' + user_id +'/coin');
                user_coin_ref.once('value', (snapshot) => {
                if(snapshot.val() !== null) {
                    let items = snapshot.val();
                    for (let key in items) {
                            if( snapshot.child(key).val()>0) {
                                if (key=="balance") {
                                    assignedCoins.push({
                                        name: "Balance in AUD",
                                        amt: snapshot.child(key).val(),
                                        averagePrice: 1,
                                        cost: "N/A",
                                        currentPrice: 1,
                                        totalWorth: snapshot.child(key).val(),
                                        profitLoss: "N/A"
                                    });
                                }
                                else {
                                    let current_price = snapshot.child('/current_prices/' + key).val();
                                    let current_amount = snapshot.child(key).val();
                                    let current_cost = snapshot.child('/amount/' + key).val();
                                    //console.log(key + " " + current_price + " " + current_amount + " " + current_cost);
                                    assignedCoins.push({
                                        name: key,
                                        amt: current_amount,
                                        averagePrice: current_cost / current_amount,
                                        cost: current_cost,
                                        currentPrice: current_price,
                                        totalWorth: current_amount * current_price,
                                        profitLoss: (current_amount * current_price) - current_cost
                                    });
                                } 
                            }  
                        this.setState({
                            coins: assignedCoins
                        });
                    }
                }
                });
            }
        });
    }

   handleSubmit(event) {
      event.preventDefault();
      let moment = require('moment');
      let momentStartDate=moment(this.state.startDate);
      let momentEndDate=moment(this.state.endDate);

      const assignedFilHistory = [];
      const historyFB = app.database().ref('history/');
      historyFB.on('value', (snapshot) => {
         if(snapshot.val() !== null){

            for(const index in snapshot.val()) {
               if (snapshot.child(index + "/user_id").val() == app.auth().currentUser.uid) {
                  let historyDate = snapshot.child(index + "/timestamp").val();
                  historyDate = historyDate.substring(0, 10);
                  let momentDate = moment(historyDate);
                  if(moment(momentDate).isBetween(momentStartDate,momentEndDate)) {

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
               <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.amt}</td>
                  <td>{item.cost}</td>
                  <td>{item.totalWorth}</td>
                  <td>{item.averagePrice}</td>
                  <td>{item.currentPrice}</td>
                  <td>{item.profitLoss}</td>
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
                                 <th>Total Cost</th>
                                 <th>Total Worth</th>
                                 <th>Average Price</th>
                                 <th>Current Price</th>
                                 <th>Profit/Loss</th>
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
      )
   }
}

export default Dashboard;