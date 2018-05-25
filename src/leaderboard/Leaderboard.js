import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import './Leaderboard.css';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import {app} from "../Constant";

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

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
        this.handleTabChange = this.handleTabChange.bind(this);
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

    handleTabChange = (event, tabValue) => {
        this.setState({ tabValue }, () => {
            this.loadHistoryData_andSaveToState();
        });

    };

    loadHistoryData_andSaveToState = () => {
        const history = app.database().ref('history');
        const filtered_history = []
        history.on('value', (snapshot) => {
            if(snapshot.val() != null){
                var moment = require('moment');
                var currentTime = moment();
                // Past 24 Hrs
                if(this.state.tabValue == 0){
                    for(const index in snapshot.val()){
                        const timestamp = snapshot.child(index +"/timestamp").val();
                        const parseTimestramp = moment(timestamp);
                        console.log('currentTime :' + currentTime.format());
                        console.log('parseTimestramp :' + parseTimestramp.format());

                        const hoursDiff = currentTime.diff(parseTimestramp, 'hours');
                        console.log('diff ' + hoursDiff);
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
                        // console.log(filtered_history)
                        this.loadUsersFromHistory();
                    });
                }
                // Past 1 Week
                else if(this.state.tabValue == 1){
                    for(const index in snapshot.val()){
                        const timestamp = snapshot.child(index +"/timestamp").val();
                        const parseTimestramp = moment(timestamp);
                        console.log('currentTime :' + currentTime.format());
                        console.log('parseTimestramp :' + parseTimestramp.format());

                        const weeksDiff = currentTime.diff(parseTimestramp, 'weeks');
                        console.log('weeksDiff ' + weeksDiff);
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
                        // console.log(filtered_history)
                        this.loadUsersFromHistory();
                    });
                }
                // Past 1 Month
                else if(this.state.tabValue == 2){
                    for(const index in snapshot.val()){
                        const timestamp = snapshot.child(index +"/timestamp").val();
                        const parseTimestramp = moment(timestamp);
                        console.log('currentTime :' + currentTime.format());
                        console.log('parseTimestramp :' + parseTimestramp.format());

                        const monthsDiff = currentTime.diff(parseTimestramp, 'months');
                        console.log('monthsDiff ' + monthsDiff);
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
                        // console.log(filtered_history)
                        this.loadUsersFromHistory();
                    });
                }
                // All Times
                else if(this.state.tabValue == 3){
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
                        // console.log(filtered_history)
                        this.loadUsersFromHistory();
                    });
                }
            }
        });
    }

    // Loop history data based on specified Timeframe
    // Then save to state

    loadUsersFromHistory = () => {
        const userLists = [];
        const historyLists = this.state.history;
        console.log('historyLists: ' + historyLists);
        for(const index in historyLists){
            if(userLists === undefined || userLists.length == 0){
                // userLists.push({
                //     uid : historyLists[index]['user_id'],
                //     data : historyLists[index]
                // });
                userLists.push(historyLists[index]['user_id']);
            }
            if(!userLists.includes(historyLists[index]['user_id'])){
                console.log('compared true');
                // userLists.push({
                //     uid : historyLists[index]['user_id'],
                //     data : historyLists[index]
                // });
                userLists.push(historyLists[index]['user_id']);
            }
        }

        const userState = [];
        for(const index in historyLists){
            for(const id in userLists){
                if(userLists[id] == historyLists[index]['user_id']){
                    const type = historyLists[index]['type'];
                    const coinTotal = historyLists[index]['coinTotal'];
                    const coinType = historyLists[index]['coinType'];
                    for(const coinIndex in this.state.coinPrice){
                        if(this.state.coinPrice[coinIndex][coinType]){
                            console.log('this.state.coinPrice[coinIndex]' + this.state.coinPrice[coinIndex]);
                            // estimate total given the current crypto-value market
                            const estCurrentTotal = historyLists[index]['amount'] * this.state.coinPrice[coinIndex][coinType];
                            console.log('coinTotal: ' + coinTotal + ' | estTotal: ' + estCurrentTotal);
                            var profitLoss_Percent = 0;
                            if(type == "Sell"){
                                const diff = coinTotal - estCurrentTotal;
                                profitLoss_Percent = diff / estCurrentTotal;
                            }else{
                                // Buy Type
                                const diff = estCurrentTotal - coinTotal;
                                profitLoss_Percent = diff / estCurrentTotal;
                            }
                            userState.push({
                                uid: userLists[id],
                                profitLossPercent: profitLoss_Percent
                            });
                        }
                    }
                }
            }
        }
        // console.log(userState);

        // Add up all the profit/loss and get the final result percentage
        var reducedState = [];
        userState.forEach(function(value) {
            var existing = reducedState.filter(function(v, i) {
                return v.uid == value.uid;
            });
            if (existing.length) {
                var existingIndex = reducedState.indexOf(existing[0]);
                reducedState[existingIndex].profitLossPercent += value.profitLossPercent;
            } else {
                reducedState.push(value);
            }
        });


        // console.log('reduced State: ')
        // console.log(reducedState);

        const newUserState = [];
        for(const index in reducedState){
            const data = app.database().ref('user/' + reducedState[index]['uid']);
            data.on('value', (snapshot) => {
                if(snapshot.val() !== null){
                    const fn = snapshot.child("/fname").val();
                    const ln = snapshot.child("/lname").val();
                    const pl = reducedState[index]['profitLossPercent'].toFixed(4);

                    newUserState.push({
                       uid:  reducedState[index]['uid'],
                        fname: fn,
                        lname: ln,
                        profitLoss: pl
                    });
                    this.setState({
                        user: newUserState
                    });
                }
            });
        }
        // if(newUserState.updated)
        this.setState({
            user: newUserState
        });
        console.log(newUserState);
    }

    retrieve_currentCryptoPrice = () => {
        this.getData = () => {
            // filter coin, pass coin from chart
            const coin = this.state.coinPrice;
            console.log('coinPrice: ' + coin);
            const coinStorage = [];
            const currency = 'AUD';
            for(const index in coin){
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
            this.setState({
                // coinType: coin,
                coinPrice: coinStorage,
                updatedAt: new Date()
            }, () => {
                console.log(this.state.coinPrice);
            });

        }
        this.getData();
        this.refresh = setInterval(() => this.getData(), 90000);
    }

    render() {
        const {classes} = this.props;
        const {tabValue} = this.state;
        // sort the ranking based on highest profit
        const sortedState = this.state.user.sort(function (a, b) {
            console.log(a.profitLoss);
            return b.profitLoss - a.profitLoss;
        });

        const userTableData = sortedState ? (
            sortedState.map(function(item, index){
                return (
                    <tbody>
                    {item.profitLoss > 0 ?
                        <tr key={item.uid} id="profit">
                            <td>{index+1}</td>
                            <td>{item.fname} {item.lname}</td>
                            <td>{item.profitLoss}</td>
                        </tr>
                    :
                        <tr key={item.uid} id="loss">
                            <td>{index+1}</td>
                            <td>{item.fname} {item.lname}</td>
                            <td>{item.profitLoss}</td>
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
                        <NavItem class="nav_item" href="/">
                            <p>Prolific Trading</p>
                        </NavItem>
                       {this.state.authenticated ? (
                        <NavItem class="nav_item" eventKey={1} href="/dashboard">
                            Portfolio
                        </NavItem> ): ( null ) }
                        <NavItem class="nav_item" eventKey={2} href="/leaderboard">
                            Leaderboard
                        </NavItem>
                    </Nav>
                    <Nav pullRight>
                        {this.state.authenticated ? (
                            <NavItem class="nav_item" eventKey={2} href="/logout">
                                Logout
                            </NavItem> ) : (
                            <NavItem class="nav_item" eventKey={2} href="/auth">
                                Login
                            </NavItem> )
                        }
                    </Nav>
                </Navbar>

                {/*Create Leaderboard of users who have made the most in specified time frames (24 hrs, 1 week, 1 month, All Time)*/}

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

                            {tabValue === 0 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData == '' ?
                                        <h2>No Data within 24 hours</h2>
                                        :
                                        (<thead className>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                </table>
                            </TabContainer>}
                            {tabValue === 1 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData == '' ?
                                        <h2>No Data within 1 week</h2>
                                        :
                                        (<thead className>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                    {/*{userTableData}*/}
                                </table>
                            </TabContainer>}
                            {tabValue === 2 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData == '' ?
                                        <h2>No Data within 1 month</h2>
                                        :
                                        (<thead className>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
                                            <th>Profit</th>
                                        </tr>
                                        </thead>) }
                                    {userTableData}
                                </table>
                            </TabContainer>}
                            {tabValue === 3 && <TabContainer>
                                <table className="table table-bordered text-center">
                                    {userTableData == '' ?
                                        <h2>No Data</h2>
                                        :
                                        (<thead className>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Trader Name</th>
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