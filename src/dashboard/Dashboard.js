import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import './../App.css';
import profile_img from './../img/profile-img.png';
import bitcoin_icon from './../img/bitcoin_icon.png';
import ethereum_icon from './../img/ethereum_icon.png';
import litecoin_icon from './../img/litecoin_icon.png';
import Switch from 'material-ui/Switch';
import Button from 'material-ui/Button';
import { app } from '../Constant';
import CryptoChart from '../graph/CryptoChart';
import firebase from 'firebase';

class Dashboard extends Component {
   constructor(props) {
      super(props);

      this.state = {
         authenticated: true,
         openTradingAccount: null,
          uid: null,
          history:[]
      };

      this.handleChange = this.handleChange.bind(this);
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
       this.loadTradingStatus();
       this.retrieve_history();
   }

   componentWillUnmount(){
      this.removeAuthListener();

   }

    loadTradingStatus = () => {
        // var ref = new Firebase("https://yourfirebase.firebaseio.com");
        // var authData = app.auth().userinfo.uid;
        var userID = firebase.auth().currentUser.uid;

        this.setState({
           uid : userID
        });

        if (userID){
            const userDB = firebase.database().ref('user/' + userID);
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



   render(){
      if(this.state.authenticated === false) {
         return <Redirect to='/'/>
      }

      return (
            <div>
               <Navbar inverse>
                  <Nav>
                     <NavItem href="/">
                        <p>MonopolyShoe</p>
                     </NavItem>
                     <NavItem eventKey={1} href="/dashboard">
                        Portfolio
                     </NavItem>
                  </Nav>
                  <Nav pullRight>
                     <NavItem eventKey={2} href="/logout">
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
                           <h2>Panhaseth Heang</h2><br/>
                           <strong>Email: seth@rmit.com </strong> <br/>
                           <strong>Trading Account</strong>
                           <div>
                              <Switch
                                 checked={this.state.openTradingAccount}
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

                           <div className="fix-overflow noPad">
                              <h4 id="heading" className="pull-left">Trading View</h4>
                              <div className='crypto_chart container-fluid'>
                                 <CryptoChart/>
                              </div>
                           </div>

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
                               {this.state.history.map((his) => {
                                   return (

                                       <table className="table table-bordered">
                                           <thead className="">
                                           <tr>
                                               <th>Date</th>
                                               <th>Coin</th>
                                               <th>Type</th>
                                               <th>Price</th>
                                               <th>Amount</th>
                                               <th>Value</th>
                                           </tr>
                                           </thead>
                                           <tbody>
                                           <tr key={his.id}>
                                               <td>{his.timestamp}</td>
                                               <td>{his.coinType}</td>
                                               <td>{his.type}</td>
                                               <td>{his.price}</td>
                                               <td>{his.amount}</td>
                                               <td>{his.coinValue}</td>
                                           </tr>
                                           </tbody>
                                       </table>
                                   )
                               })}
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