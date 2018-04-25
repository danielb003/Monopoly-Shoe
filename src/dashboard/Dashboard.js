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

class Dashboard extends Component {
   constructor() {
      super();

      this.state = {
         authenticated: true,
         openTradingAccount: true
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
      })
   }

   componentWillUnmount(){
      this.removeAuthListener();
   }

   handleChange() {

   }

   render(){
      if(this.state.authenticated === false) {
         return <Redirect to='/'/>
      }

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
                           <h2>Panhaseth Heang</h2><br/>
                           <strong>Email: seth@rmit.com </strong> <br/>
                           <strong>Trading Account</strong>
                           <div>
                              <Switch
                                 checked={this.state.openTradingAccount}
                                 onChange={this.handleChange('openTradingAccount')}
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
                              <table className="table table-bordered">
                                 <thead className="">
                                 <tr>
                                    <th>Date</th>
                                    <th>Pair</th>
                                    <th>Type</th>
                                    <th>Price</th>
                                    <th>Filled</th>
                                    <th>Fee</th>
                                    <th>Total</th>
                                 </tr>
                                 </thead>
                                 <tbody>
                                 <tr>
                                    <td>2017-11-23 19:19:23
                                    </td>
                                    <td>BCC/ETH</td>
                                    <td id="sell">Sell</td>
                                    <td>0.00016800</td>
                                    <td>1685</td>
                                    <td>0.03838254 BNB</td>
                                    <td>0.2830800 ETH</td>

                                 </tr>
                                 <tr>
                                    <td>2017-11-25 13:11:21
                                    </td>
                                    <td>LTE/ETH</td>
                                    <td id="buy">Buy</td>
                                    <td>0.00025800</td>
                                    <td>805</td>
                                    <td>0.13838254 BNB</td>
                                    <td>1.6830800 ETH</td>
                                 </tr>
                                 <tr>
                                    <td>2018-01-23 08:22:33
                                    </td>
                                    <td>BCC/ETH</td>
                                    <td id="sell">Sell</td>
                                    <td>0.00016800</td>
                                    <td>2005</td>
                                    <td>0.19838254 BNB</td>
                                    <td>0.6830800 ETH</td>
                                 </tr>
                                 </tbody>
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