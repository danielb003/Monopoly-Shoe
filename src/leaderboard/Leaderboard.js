import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, NavbarBrand, MenuItem} from 'react-bootstrap';
import './Leaderboard.css';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';


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
        }
    }

    handleTabChange = (event, tabValue) => {
        this.setState({ tabValue });
    };

    render(){
        const { classes } = this.props;
        const { tabValue } = this.state;
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