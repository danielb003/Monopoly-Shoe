import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import './Leaderboard.css';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import firebase from "firebase";

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
        }
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    componentDidMount() {
        this.loadHistoryData_andSaveToState();
    }

    handleTabChange = (event, tabValue) => {
        this.setState({ tabValue }, () => {
            this.loadHistoryData_andSaveToState();
        });

    };

    loadHistoryData_andSaveToState = () => {
        const history = firebase.database().ref('history');
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
                        console.log(filtered_history)
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
                        console.log(filtered_history)
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
                        console.log(filtered_history)
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
                        console.log(filtered_history)
                    });
                }

            }
        });
    }

    // Loop history data based on specified Timeframe
    // Then save to state


    // loop history [] data from state and get user_id
    // get current crypto value
    // calculate profit/loss for each history node
    // sum up profit/loss and calculate in %
    // assign this profit field to user state


    // Loop the user data from state
    // Then display, ordered by profit and assign Rank

    render(){
        const { classes } = this.props;
        const { tabValue } = this.state;
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
                        <NavItem class="nav_item" eventKey={3} href="/logout">
                            Logout
                        </NavItem>
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
                            {tabValue === 0 && <TabContainer>Last 24 Hours Data</TabContainer>}
                            {tabValue === 1 && <TabContainer>1 Week Data</TabContainer>}
                            {tabValue === 2 && <TabContainer>1 Month Data</TabContainer>}
                            {tabValue === 3 && <TabContainer>All Time Data</TabContainer>}
                        </div>

                        <br/>
                        <table className="table table-bordered text-center">
                            <tr>
                                <th>Rank</th>
                                <th>Trader Name</th>
                                <th>Number of Trades</th>
                                <th>Profit</th>
                                <th>Market Value</th>
                            </tr>
                            <tbody>
                            <tr>
                                <td>1</td>
                                <td>Test User 1</td>
                                <td>24</td>
                                <td>15%</td>
                                <td>$54.324.41</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Test User 2</td>
                                <td>33</td>
                                <td>14.4%</td>
                                <td>$34.324.41</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Test User 3</td>
                                <td>15</td>
                                <td>9.4%</td>
                                <td>$29.324.41</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Leaderboard);