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
      };

      this.handleChange = this.handleChange.bind(this);
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
      // this.loadTradingStatus();
       this.retrieve_history();
       this.retrieve_userData();
       this.loadTradingStatus();
   }

   componentWillUnmount(){
      this.removeAuthListener();

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
                    console.log('load trading : ' + trading);
                    this.setState({
                        openTradingAccount: trading
                    });
                });
            }
        });
    }

    handleChange = event => {
        // this.setState({ [name]: event.target.checked }, () => {
        //     this.setState({
        //         openTradingAccount: event.target.checked
        //     })
        // });

        // });

        // this.setState({ [name]: event.target.checked } , () => {
        //    this.setState()
        //     openTradingAccount: event.target.checked
        // });
        //  if (this.state.openTradingAccount == false){
        //      event.target.checked = false;
        //  }else {
        //      event.target.checked = true;
        //  }
        this.setState({
            // [name]: event.target.checked,
            openTradingAccount: event.target.checked
        });
        this.updateTrading();
    }

    updateTrading = () => {
        console.log(this.state.openTradingAccount);
        var user = firebase.auth().currentUser;
        const tradingStatus = firebase.database().ref('user/' + user.uid);
        var tradingDB;
        tradingStatus.on('value', (snapshot) => {
            if (snapshot.val() !== null) {
               tradingDB = snapshot.child("/trading").val();
            }
        });
        console.log('tradingDB: ' + tradingDB);
                // const sellOrderFB = firebase.database().ref('sell/');
        // buyOrderFB.on('value', (snapshot) => {
        //     if(snapshot.val() !== null){
         console.log('trading status in handle change ' + tradingStatus);
        firebase.database().ref('user/' + user.uid + '/').update({
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

    handleSubmit(event) {
        // this.loadTimestamp(event);
        // this.loadTimestamp(event).then(() => {
        event.preventDefault();
        var moment = require('moment');
      /*  const target = event.target;
        const value = target.value;
        const name = target.name;

            this.setState({
                [name]: value
            });*/

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
                  <Nav>
                     <NavItem class="nav_item" href="/">
                        <p>MonopolyShoe</p>
                     </NavItem>
                     <NavItem class="nav_item" eventKey={1} href="/dashboard">
                        Portfolio
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
                            {user_data.admin ? (<strong>Admin User</strong>) : (<strong>Regular User</strong>)}
                            <br/><br/>
                           <strong>Trading Account</strong>
                           <div>
                              <Switch
                                 checked={user_data.trading}
                                 onChange={this.handleChange}
                                 value="Enable"
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
                                 <thead className="">
                                 <tr>
                                    <th>Coin</th>
                                    <th>Name</th>
                                    <th>Total Balance</th>
                                    <th>Available Balance</th>
                                    <th>BTC Value</th>
                                    <th></th>
                                 </tr>
                                 </thead>

                                   {/*{portfolioTable}*/}
                                 <tbody>
                                 <tr>
                                    <td><img id="crypto_icon" src={ bitcoin_icon } className="noPad img-responsive"/>
                                    </td>
                                    <td>Bitcoin</td>
                                    <td>2,500.0083</td>
                                    <td>2,500.0083</td>
                                    <td>0.01417</td>
                                    <td>
                                       <Button size="small" color="primary" >
                                          Deposit
                                       </Button>
                                       <Button size="small" color="secondary" >
                                          Withdrawal
                                       </Button>
                                       <Button size="small" color="default">
                                          Trade
                                       </Button>
                                    </td>

                                 </tr>
                                 <tr>
                                    <td><img id="crypto_icon" src={ litecoin_icon } className="noPad img-responsive"/>
                                    </td>
                                    <td>Litecoin</td>
                                    <td>1,327.8269</td>
                                    <td>1,327.8269</td>
                                    <td>0.02953</td>
                                    <td className="noPad">
                                       <Button size="small" color="primary" >
                                          Deposit
                                       </Button>
                                       <Button size="small" color="secondary" >
                                          Withdrawal
                                       </Button>
                                       <Button size="small" color="default">
                                          Trade
                                       </Button>
                                    </td>
                                 </tr>
                                 <tr>
                                    <td><img id="crypto_icon" src={ ethereum_icon } className="noPad img-responsive"/>
                                    </td>
                                    <td>Ethereum</td>
                                    <td>1,000.5196</td>
                                    <td>1,000.5196</td>
                                    <td>0.02936</td>
                                    <td>
                                       <Button size="small" color="primary" >
                                          Deposit
                                       </Button>
                                       <Button size="small" color="secondary" >
                                          Withdrawal
                                       </Button>
                                       <Button size="small" color="default">
                                          Trade
                                       </Button>
                                    </td>
                                 </tr>
                                 </tbody>
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
      );
   }

}

export default Dashboard;