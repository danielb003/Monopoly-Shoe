/*
Leaderboard Page
Author: Panhaseth Heang
Refactored By: Panhaseth Heang
Date: 07/06/2018
*/

import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import './Leaderboard.css';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import {app} from "../Constant";

// Style for elements inside each Tab
function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

// Material UI Style
const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class Leaderboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            tabValue : 0,
            history: [],
            authenticated: false,
            user: [],
            coinPrice: {
                BTC: 0,
                EOS: 0,
                ETH: 0,
                LTC: 0,
                NEO: 0,
                NULS: 0,
                XMR: 0,
                XRP: 0
            }
        }
        // Bindings before usage
        this.handleTabChange = this.handleTabChange.bind(this);
        this.loadHistoryData_andSaveToState = this.loadHistoryData_andSaveToState.bind(this);
        this.loadUsersFromHistory = this.loadUsersFromHistory.bind(this);
        this.retrieve_currentCryptoPrice = this.retrieve_currentCryptoPrice.bind(this);
    }

    componentWillMount() {
        this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
            if(user) {
                this.setState({ authenticated : true })
            } else {
                this.setState({ authenticated: false })
            }
        });
    }

    componentDidMount() {
        this.loadHistoryData_andSaveToState();
        this.retrieve_currentCryptoPrice();
    }

    /* Handle Each Tab Clicked, then load the filtered content respectively */
    handleTabChange(event, tabValue){
        this.setState({ tabValue }, () => {
            this.loadHistoryData_andSaveToState();
        });
    };

    /*
    Loop history data based on specified Timeframes (eg. 24 Hrs, Last Week, Last Month, All Time)
    Then save to state
    */
    loadHistoryData_andSaveToState() {
        const history = app.database().ref('history');
        const filtered_history = []
        // API call to Firebase Database and get data from 'history' node
        history.on('value', (snapshot) => {
            if(snapshot.val() != null){
                // DateTime manipulation using 'moment' nodeJS library
                var moment = require('moment');
                var currentTime = moment();
                // Filter for Past 24 Hrs
                if(this.state.tabValue === 0){
                    for(const index in snapshot.val()){
                        const timestamp = snapshot.child(index +"/timestamp").val();
                        const parseTimestramp = moment(timestamp);
                        const hoursDiff = currentTime.diff(parseTimestramp, 'hours');

                        if (hoursDiff <= 24){
                            filtered_history.push({
                                user_id: snapshot.child(index + "/user_id").val(),
                                type: snapshot.child(index + "/type").val(),
                                amount: snapshot.child(index + "/amount").val(),
                                price: snapshot.child(index + "/price").val(),
                                total: snapshot.child(index + "/total").val(),
                                coinType: snapshot.child(index + "/coinType").val(),
                                coinValue: snapshot.child(index + "/coinValue").val(),
                                coinTotal: snapshot.child(index + "/coinTotal").val(),
                                timestamp: snapshot.child(index + "/timestamp").val()
                            })
                        }
                    }
                    this.setState({
                        history: filtered_history
                    }, () => {
                        this.loadUsersFromHistory();
                    });
                }
                // Filter for Past 1 Week
                else if(this.state.tabValue === 1){
                    for(const index in snapshot.val()){
                        const timestamp = snapshot.child(index +"/timestamp").val();
                        const parseTimestramp = moment(timestamp);
                        const weeksDiff = currentTime.diff(parseTimestramp, 'weeks');

                        if (weeksDiff < 1){
                            filtered_history.push({
                                user_id: snapshot.child(index + "/user_id").val(),
                                type: snapshot.child(index + "/type").val(),
                                amount: snapshot.child(index + "/amount").val(),
                                price: snapshot.child(index + "/price").val(),
                                total: snapshot.child(index + "/total").val(),
                                coinType: snapshot.child(index + "/coinType").val(),
                                coinValue: snapshot.child(index + "/coinValue").val(),
                                coinTotal: snapshot.child(index + "/coinTotal").val(),
                                timestamp: snapshot.child(index + "/timestamp").val()
                            })
                        }
                    }
                    this.setState({
                        history: filtered_history
                    }, () => {
                        this.loadUsersFromHistory();
                    });
                }
                // Filter for Past 1 Month
                else if(this.state.tabValue === 2){
                    for(const index in snapshot.val()){
                        const timestamp = snapshot.child(index +"/timestamp").val();
                        const parseTimestramp = moment(timestamp);
                        const monthsDiff = currentTime.diff(parseTimestramp, 'months');

                        if (monthsDiff < 1){
                            filtered_history.push({
                                user_id: snapshot.child(index + "/user_id").val(),
                                type: snapshot.child(index + "/type").val(),
                                amount: snapshot.child(index + "/amount").val(),
                                price: snapshot.child(index + "/price").val(),
                                total: snapshot.child(index + "/total").val(),
                                coinType: snapshot.child(index + "/coinType").val(),
                                coinValue: snapshot.child(index + "/coinValue").val(),
                                coinTotal: snapshot.child(index + "/coinTotal").val(),
                                timestamp: snapshot.child(index + "/timestamp").val()
                            })
                        }
                    }
                    this.setState({
                        history: filtered_history
                    }, () => {
                        this.loadUsersFromHistory();
                    });
                }
                // Filter for All Times
                else if(this.state.tabValue === 3){
                    for(const index in snapshot.val()){
                        filtered_history.push({
                            user_id: snapshot.child(index + "/user_id").val(),
                            type: snapshot.child(index + "/type").val(),
                            amount: snapshot.child(index + "/amount").val(),
                            price: snapshot.child(index + "/price").val(),
                            total: snapshot.child(index + "/total").val(),
                            coinType: snapshot.child(index + "/coinType").val(),
                            coinValue: snapshot.child(index + "/coinValue").val(),
                            coinTotal: snapshot.child(index + "/coinTotal").val(),
                            timestamp: snapshot.child(index + "/timestamp").val()
                        })
                    }
                    this.setState({
                        history: filtered_history
                    }, () => {
                        this.loadUsersFromHistory();
                    });
                }
            }
        });
    }

    /*
    First, Get Users and History Data
    Then, Calculate the final profit/loss percentage for each user from transaction records
    And, Save to State
    */
    loadUsersFromHistory() {
        const userLists = [];
        const historyLists = this.state.history;
        console.log('historyLists: ' + historyLists);
        for(const index in historyLists){
            if(userLists === undefined || userLists.length === 0){
                userLists.push(historyLists[index]['user_id']);
            }
            if(!userLists.includes(historyLists[index]['user_id'])){
                userLists.push(historyLists[index]['user_id']);
            }
        }

        const userState = [];
        for(const index in historyLists){
            for(const id in userLists){
                if(userLists[id] === historyLists[index]['user_id']){
                    const type = historyLists[index]['type'];
                    const coinTotal = historyLists[index]['coinTotal'];
                    const coinType = historyLists[index]['coinType'];
                    for(const coinIndex in this.state.coinPrice){
                        if(this.state.coinPrice[coinIndex][coinType]){
                            // Estimate Total using the current crypto-value market value
                            const estCurrentTotal = historyLists[index]['amount'] * this.state.coinPrice[coinIndex][coinType];
                            var profitLoss_Percent = 0;
                            // Check type; buy or sell?
                            // Then, calculate profit/loss % for each transaction record
                            if(type === "Sell"){
                                const diff = coinTotal - estCurrentTotal;
                                profitLoss_Percent = diff / estCurrentTotal;
                            }else{
                                const diff = estCurrentTotal - coinTotal;
                                profitLoss_Percent = diff / estCurrentTotal;
                            }
                            // save
                            userState.push({
                                uid: userLists[id],
                                profitLossPercent: profitLoss_Percent
                            });
                        }
                    }
                }
            }
        }

        // Add up all the profit/loss % from each transaction
        // Then, get the final result percentage for each user
        var reducedState = [];
        userState.forEach(function(value) {
            var existing = reducedState.filter(function(v, i) {
                return (v.uid === value.uid);
            });
            if (existing.length) {
                var existingIndex = reducedState.indexOf(existing[0]);
                // set count to 0 if NaN type
                if (isNaN(reducedState[existingIndex].count)){
                    reducedState[existingIndex].count = 0;
                }
                // Sum up all profit/loss % and count
                reducedState[existingIndex].profitLossPercent += value.profitLossPercent;
                reducedState[existingIndex].count += 1;
            } else {
                reducedState.push(value);
            }
        });

        const newUserState = [];
        for(const index in reducedState){
            // API call to Firebase Database and get data from 'user/[uid]' node
            const data = app.database().ref('user/' + reducedState[index]['uid']);
            data.on('value', (snapshot) => {
                if(snapshot.val() !== null){
                    // get first name and last name from each user node
                    const fn = snapshot.child("/fname").val();
                    const ln = snapshot.child("/lname").val();
                    if (!reducedState[index]['count']) {
                        reducedState[index]['count'] = 1;
                    }
                    // Get Final percentage by divide sum of profit/loss % with total counts of trades,
                    // and round up to 2 decimal places
                    const pl = ((reducedState[index]['profitLossPercent'] * 100) / reducedState[index]['count']).toFixed(2);
                    const num = reducedState[index]['count'] + 1;
                    // save the profit/loss % data to state for final display
                    newUserState.push({
                        uid:  reducedState[index]['uid'],
                        fname: fn,
                        lname: ln,
                        profitLoss: pl,
                        trade: num
                    });
                    this.setState({
                        user: newUserState
                    });
                }
            });
        }
        this.setState({
            user: newUserState
        });
    }
    /*
    Get the Current Cryptocurrency market value from API calls
    */
    retrieve_currentCryptoPrice(){
        this.getData = () => {
            // filter coin, pass coin from chart
            const coin = this.state.coinPrice;
            console.log('coinPrice: ' + coin);
            const coinStorage = [];
            const currency = 'AUD';
            for(const index in coin){
                // get coin data from API call
                const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + index + '&tsyms=' + currency;
                fetch(url).then(r => r.json())
                    .then((coinData) => {
                        const price = coinData.AUD;

                        coinStorage.push({
                            [index]: price
                        });
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
            // save to state
            this.setState({
                coinPrice: coinStorage,
                updatedAt: new Date()
            });
        }
        this.getData();
        // refresh API call every 90 seconds
        this.refresh = setInterval(() => this.getData(), 90000);
    }

    render() {
        const {classes} = this.props;
        const {tabValue} = this.state;
        // sort the ranking based on highest profits
        const sortedState = this.state.user.sort(function (a, b) {
            console.log(a.profitLoss);
            return b.profitLoss - a.profitLoss;
        });

        // fill in the table row for each user data
        const userTableData = sortedState ? (
            sortedState.map(function(item, index){
                return (
                    <tbody>
                    {item.profitLoss > 0 ?
                        <tr key={item.uid} id="profit">
                            <td>{index+1}</td>
                            <td>{item.fname} {item.lname}</td>
                            <td>{item.trade}</td>
                            <td>{item.profitLoss} %</td>
                        </tr>
                    :
                        <tr key={item.uid} id="loss">
                            <td>{index+1}</td>
                            <td>{item.fname} {item.lname}</td>
                            <td>{item.trade}</td>
                            <td>{item.profitLoss} %</td>
                        </tr>
                    }
                    </tbody>
                )
            })) : (
            null
        );


        return (
            <div>
                <Navbar inverse>
                    <Nav id="nav_box">
                        <NavItem className="nav_item" href="/">
                            <p>Prolific Trading</p>
                        </NavItem>
                       {this.state.authenticated && !this.state.adminStatus ? (
                          <NavItem className="nav_item" eventKey={1} href="/dashboard">
                             Portfolio
                          </NavItem>
                       ) : this.state.authenticated && !this.state.adminStatus ? (
                          <NavItem className="nav_item" eventKey={1} href="/admin">
                             Admin
                          </NavItem>
                       ) : !this.state.authenticated && !this.state.adminStatus ? (
                          <NavItem className="nav_item" eventKey={1} href="/">
                             Market
                          </NavItem>
                       ) : null }
                        <NavItem className="nav_item" eventKey={2} href="/leaderboard">
                            Leaderboard
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        {this.state.authenticated ? (
                            <NavItem className="nav_item" eventKey={2} href="/logout">
                                Logout
                            </NavItem> ) : (
                            <NavItem className="nav_item" eventKey={2} href="/auth">
                                Login
                            </NavItem> )
                        }
                    </Nav>
                </Navbar>

                {/*Create Leaderboard of users who have made the most
                in specified time frames (24 hrs, 1 week, 1 month, All Time)*/}
                <div className='container'>
                    <div className='col-md-12'>
                        <h3 id='leaderboard'>Leaderboard</h3>

                        <div className={classes.root}>
                            <AppBar position="static">
                                <Tabs value={tabValue} onChange={this.handleTabChange}>
                                    <Tab label="24 HRS" size='large'/>
                                    <Tab label="1 Week" />
                                    <Tab label="1 Month" />
                                    <Tab label="All Times" />
                                </Tabs>
                            </AppBar>
                            {/* 24 Hrs Tab */}
                            {tabValue === 0 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData.length === 0 ?
                                        <h2>No Data within 24 hours</h2>
                                        :
                                        (<thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Trades</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                </table>
                            </TabContainer>}
                            {/* Past Week Tab */}
                            {tabValue === 1 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData.length === 0 ?
                                        <h2>No Data within 1 week</h2>
                                        :
                                        (<thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Trades</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                </table>
                            </TabContainer>}
                            {/* Past Month Tab */}
                            {tabValue === 2 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData.length === 0 ?
                                        <h2>No Data within 1 month</h2>
                                        :
                                        (<thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Trades</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                </table>
                            </TabContainer>}
                            {/* All Times Tab */}
                            {tabValue === 3 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData.length === 0 ?
                                        <h2>No Data</h2>
                                        :
                                        (<thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Trades</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                </table>
                            </TabContainer>}
                        </div>
                        <br/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Leaderboard);