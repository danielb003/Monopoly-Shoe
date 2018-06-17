/*
Transaction Page
Author: Panhaseth Heang
Edited and Refactored By: Peter Locarnini
Date: 16/06/2018
*/

import React, { Component } from 'react';
import './Transaction.css';
import RaisedButton from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles} from 'material-ui/styles';
import { app } from "../Constant";
import firebase from "firebase/index";

// Material UI theme style
const styles = theme => ({
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: "1px solid #ced4da",
        fontSize: 16,
        padding: "10px 12px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        "&:focus": {
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
        }
    },
    totalInput: {
        fontSize:16
    }

});

class Transaction extends Component{

    constructor(props){
        super(props);
        this.state = {
            currentPrice: null,
            updatedAt: null,
            buyOrders: [],
            sellOrders: [],
            current_order: null,
            buyPrice: null,
            sellPrice: null,
            buyAmount: null,
            sellAmount: null,
            buyTotal: null,
            sellTotal: null,
            timestamp: null,
            pairs: [{name: "BTC"},{name: "LTC"},{name: "ETH"},{name: "NULS"},{name: "XRP"},{name: "XMR"},{name: "NEO"},{name: "EOS"}],
            coinType: 'BTC',
            uid: null
        }
        // Bindings before usage
        this.handleBuyPriceChange = this.handleBuyPriceChange.bind(this);
        this.handleBuyAmountChange = this.handleBuyAmountChange.bind(this);
        this.handleSellPriceChange = this.handleSellPriceChange.bind(this);
        this.handleSellAmountChange = this.handleSellAmountChange.bind(this);
        this.loadTimestamp = this.loadTimestamp.bind(this);
        this.loadUserID = this.loadUserID.bind(this);
        this.save_BuyOrder = this.save_BuyOrder.bind(this);
        this.save_SellOrder = this.save_SellOrder.bind(this);
        this.retrieve_orders = this.retrieve_orders.bind(this);
        this.handleBuyTotalChange = this.handleBuyTotalChange.bind(this);
        this.handleSellTotalChange = this.handleSellTotalChange.bind(this);
    }

    componentDidMount(){
        this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
            if(user) {
                this.setState({ authenticated : true })
            } else {
                this.setState({ authenticated: false })
            }
        });
        // load User ID and refresh the process order function every 5 seconds
        this.loadUserID();
        this.refresh = setInterval(() => this.process_orders(), 5000);
    }

    /*
    Get Buy order from Firebase Database and save to 'buyOrders' state
    Get Sell order from Firebase Database and save to 'sellOrders' state
    @Param: None
     */
    retrieve_orders(){
        const assignedBuyOrder = [];
        const assignedSellOrder = [];
        // get data from 'buy' and 'sell' node from Firebase DB
        const buyOrderFB = firebase.database().ref('buy/');
        const sellOrderFB = firebase.database().ref('sell/');
        buyOrderFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){
                for(const index in snapshot.val()){
                    assignedBuyOrder.push({
                        id:index,
                        amount:snapshot.child(index + "/amount").val(),
                        price:snapshot.child(index + "/price").val(),
                        total:snapshot.child(index + "/total").val(),
                        user_id:snapshot.child(index +"/user_id").val(),
                        process:snapshot.child(index +"/process").val(),
                        timestamp:snapshot.child(index +"/timestamp").val(),
                        coinType:snapshot.child(index +"/coinType").val(),
                        coinValue:snapshot.child(index +"/coinValue").val(),
                        coinTotal:snapshot.child(index +"/coinTotal").val()
                    });
                }
                this.setState({
                    buyOrders: assignedBuyOrder
                });
            }
        });
        sellOrderFB.on('value', (snapshot) => {
            if(snapshot.val() !== null){
                for(const index in snapshot.val()){
                    assignedSellOrder.push({
                        id:index,
                        amount:snapshot.child(index + "/amount").val(),
                        price:snapshot.child(index + "/price").val(),
                        total:snapshot.child(index + "/total").val(),
                        user_id:snapshot.child(index +"/user_id").val(),
                        process:snapshot.child(index +"/process").val(),
                        timestamp:snapshot.child(index +"/timestamp").val(),
                        coinType:snapshot.child(index +"/coinType").val(),
                        coinValue:snapshot.child(index +"/coinValue").val(),
                        coinTotal:snapshot.child(index +"/coinTotal").val()
                    });
                }
                this.setState({
                    sellOrders: assignedSellOrder
                });
            }
        });

    }

    /*
    Update the current price of a specific crypto-coin
    @Param: coin, user id
     */
    update_current_price_fb(pairs, uid) {
        const currentPriceFb = app.database().ref('portfolio/' + uid + '/current_prices/');
        pairs.map((pair) => {
            if (pair !== undefined)
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

    /*
    Process buy orders on the Firebase DB; re-assess the user financial data(coins and balance) after each buy order
    @Param: a list of buy orders
     */
    process_buy_orders_fb(buyOrderLists) {
        for (const index in buyOrderLists) {
            let current_coin_type = buyOrderLists[index]["coinType"];
            let buy_total = buyOrderLists[index]["total"];
            let buy_amount = buyOrderLists[index]["amount"];
            let uid = buyOrderLists[index]["user_id"];
            const user = firebase.database().ref('portfolio/' + uid);
            // load user financial data from Firebase DB
            user.on('value', (snapshot) => {
                if (snapshot.val() !== null) {
                    let final_user_coin = null;
                    let final_user_balance = null;
                    let final_user_coin_amount_spent = null;
                    // check if the coins' current value is less than or equal to the buy orders' values
                    if (snapshot.child("/current_prices/" + current_coin_type).val() <= buyOrderLists[index]["price"]) {
                        let user_coin = snapshot.child("/assets/" + current_coin_type).val();
                        let user_balance = snapshot.child("/assets/balance").val();
                        let user_coin_amount_spent = snapshot.child("/amount_spent/" + current_coin_type).val();
    
                        final_user_coin = user_coin + buy_amount;
                        final_user_balance = user_balance - buy_total;
                        final_user_coin_amount_spent = user_coin_amount_spent + buy_total;
    
                        let oid = null;
                        let status = null;
                        // load process status from all buy orders
                        const buyOrderFB = firebase.database().ref('buy/');
                        buyOrderFB.on('value', (snapshot) => {
                            if(snapshot.val() !== null){
                                for(const indexJ in snapshot.val()){
                                    if (indexJ === buyOrderLists[index]["id"] ){
                                        oid = indexJ;
                                        // get process status; true or false
                                        status = snapshot.child(indexJ + "/process").val()
                                    }
                                }
                            }
                        });
                        // if process status is false, then process the transaction
                        if (status === false) {
                            let updates = {};
                            updates['portfolio/' + uid + '/assets/' + current_coin_type] = final_user_coin;
                            updates['portfolio/' + uid + '/assets/balance'] = final_user_balance;
                            updates['portfolio/' + uid + '/amount_spent/' + current_coin_type] = final_user_coin_amount_spent;
    
                            // update only one field and does not overwrite other fields
                            firebase.database().ref('buy/' + oid + '/').update({
                                process: true
                            });
                            firebase.database().ref().update(updates);
    
                            const buyOrder = firebase.database().ref('buy/' + oid + '/');
                            buyOrder.on('value', (snapshot) => {
                                if (snapshot.val() !== null) {
                                    // copy to a new record in history node
                                    firebase.database().ref('history/').push({
                                        amount: snapshot.child("/amount").val(),
                                        coinType: snapshot.child("/coinType").val(),
                                        coinValue: snapshot.child("/coinValue").val(),
                                        coinTotal: snapshot.child("/coinTotal").val(),
                                        price: snapshot.child("/price").val(),
                                        total: snapshot.child("/total").val(),
                                        timestamp: snapshot.child("/timestamp").val(),
                                        type: "Buy",
                                        user_id: snapshot.child("/user_id").val()
                                    });
                                    // then remove the processed transaction record from the 'buy' node
                                    const processed_transaction = firebase.database().ref('buy/' + oid + '/');
                                    processed_transaction.remove();
                                }
                            });
                        }
                    }
                }
            });
        }
    }

    /*
    Process sell orders on the Firebase DB; re-assess the user financial data(coins and balance) after each sell order
    @Param: a list of sell orders
     */
    process_sell_orders_fb(sellOrderLists) {
        for(const index in sellOrderLists){
            let sell_total = sellOrderLists[index]["total"];
            let sell_amount = sellOrderLists[index]["amount"];
            let uid = sellOrderLists[index]["user_id"];
            let current_coin_type = sellOrderLists[index]["coinType"];
            const user = firebase.database().ref('portfolio/' + uid);
            user.on('value', (snapshot) => {
                let final_user_coin = null;
                let final_user_balance = null;
                let final_user_coin_amount_spent = null;
                if (snapshot.val() !== null) {
                    // check if the coins' current value is larger than or equal to the sell orders' values
                    if (snapshot.child("/current_prices/" + current_coin_type).val() >= sellOrderLists[index]["price"]){
                        let user_coin = snapshot.child("/assets/" + current_coin_type).val();
                        let user_balance = snapshot.child("/assets/balance").val();
                        let user_coin_amount_spent = snapshot.child("/amount_spent/" + current_coin_type).val();
    
                        final_user_coin = user_coin - sell_amount;
                        final_user_balance = user_balance + sell_total;
                        final_user_coin_amount_spent = user_coin_amount_spent - sell_total;
    
                        let oid = null;
                        let status = null;
                        // load process status from all sell orders
                        const sellOrderFB = firebase.database().ref('sell/');
                        sellOrderFB.on('value', (snapshot) => {
                            if(snapshot.val() !== null){
                                for(const indexJ in snapshot.val()){
                                    if (indexJ === sellOrderLists[index]["id"] ){
                                        oid = indexJ;
                                        // get process status; true or false
                                        status = snapshot.child(indexJ + "/process").val()
                                    }
                                }
                            }
                        });
                        // if process status is false, then process the transaction record
                        if (status === false) {
                            let updates = {};
                            updates['portfolio/' + uid + '/assets/' + current_coin_type] = final_user_coin;
                            updates['portfolio/' + uid + '/assets/balance'] = final_user_balance;
                            updates['portfolio/' + uid + '/amount_spent/' + current_coin_type] = final_user_coin_amount_spent;

                            // update only one field without affecting other fields
                            firebase.database().ref('sell/' + oid + '/').update({
                                process: true
                            });
                            firebase.database().ref().update(updates);
    
                            const sellOrder = firebase.database().ref('sell/' + oid + '/');
                            sellOrder.on('value', (snapshot) => {
                                if (snapshot.val() !== null) {
                                    // copy to a new record in history node
                                    firebase.database().ref('history/').push({
                                        amount: snapshot.child("/amount").val(),
                                        coinType: snapshot.child("/coinType").val(),
                                        coinValue: snapshot.child("/coinValue").val(),
                                        coinTotal: snapshot.child("/coinTotal").val(),
                                        price: snapshot.child("/price").val(),
                                        total: snapshot.child("/total").val(),
                                        timestamp: snapshot.child("/timestamp").val(),
                                        type: "Sell",
                                        user_id: snapshot.child("/user_id").val()
                                    });
                                    // then remove the processed transaction record from the 'sell' node
                                    const processed_transaction = firebase.database().ref('sell/' + oid + '/');
                                    processed_transaction.remove();
                                }
                            });
                        }
                    }
                }
            });
        }    
    }

    /*
    Any coin clicked, will update the current coin state and its value
    @Param: coin selected
    */
    componentWillReceiveProps(props){
        if (props.coin !== this.state.coinType){
            this.setState({
                coinType : props.coin
            }, () => this.update_current_price_fb(this.state.pairs, this.state.uid));
        }
    }

    /* load user id and save to state */
    loadUserID(){
        let authData = firebase.auth().currentUser;
        if (authData) {
            this.setState({
                uid : authData.uid
            })
        }
    }

    /* load current timestamp and save to state */
    loadTimestamp(event){
        let moment = require('moment');
        let currentTime = moment();
        currentTime = currentTime.format();
        this.setState({
            timestamp: currentTime
        });
        event.preventDefault();
    }

    /*
    Validate the buy transaction and Save the buy order
    @Param: Click Event on the Buy button
     */
    save_BuyOrder = (event) => {
        event.preventDefault();
        let moment = require('moment');
        let currentTime = moment();
        // get current time stamp
        currentTime = currentTime.format();
        // validate the Total
        if (this.state.buyTotal === null || 0){
            alert("Buy Total is 0!");
            return;
        }
        // validate buy order
        this.validate_buy = () => {
            this.update_current_price_fb(this.state.pairs, this.state.uid);
            const current_coin_type = this.state.coinType;
            const portfolioData = firebase.database().ref('portfolio/' + this.state.uid);
            portfolioData.once('value', (snapshot) => {
                if(snapshot.val() !== null) {
                    const coin_bal = snapshot.child('/assets/balance').val();
                    const coin_current_price = snapshot.child("/current_prices/" + current_coin_type).val();
                    for (const index in snapshot.child('/assets/').val()){
                        if (index === current_coin_type){
                            // Check if there is enough balance for transaction
                            if( coin_bal < this.state.buyTotal){
                                alert('Not Enough Balance');
                                return;
                            }
                            else
                            {
                                // save the data as a buy order to 'buy' node in Firebase DB
                                this.setState({
                                    timestamp: currentTime
                                }, () => {
                                    firebase.database().ref('buy/').push({
                                        price: this.state.buyPrice,
                                        amount: parseInt(this.state.buyAmount),
                                        total: this.state.buyTotal,
                                        user_id: this.state.uid,
                                        process: false,
                                        timestamp: this.state.timestamp,
                                        coinType: current_coin_type,
                                        coinValue: coin_current_price,
                                        coinTotal: coin_current_price * parseInt(this.state.buyAmount)
                                    }).catch(function (error) {
                                        alert('Buy order failed, please try again');
                                    });
                                    alert('Buy order is successfully submitted');
                                    // set the UI's buy data fields to empty after order saved
                                    this.setState({
                                        buyAmount: '',
                                        buyPrice: '',
                                        buyTotal: ''
                                    });
                                });
                            }
                        }
                    }
                }
            });
        }
        this.validate_buy();
        this.retrieve_orders();
    }

    /*
    Validate the sell transaction and Save the sell order
    @Param: Click Event on the Sell button
     */
     save_SellOrder = (event) => {
        event.preventDefault();
        let moment = require('moment');
        let currentTime = moment();
        // get current time stampt
        currentTime = currentTime.format();
        this.update_current_price_fb(this.state.pairs, this.state.uid);
        let current_coin_type = this.state.coinType
        const portfolioData = firebase.database().ref('portfolio/' + this.state.uid);
        console.log('current timestamp: ' + currentTime);
        // Check the sell Total if empty
        if (this.state.sellTotal === null ||
            this.state.sellTotal === 0){
            alert("Sell Total is 0!");
            return;
        }
        // check if the sell price is less than the coin's current value
        portfolioData.once('value', (snapshot) => {
            if(snapshot.val() !== null) {
                if (this.state.sellPrice < snapshot.child("/current_prices/" + current_coin_type).val()){
                    alert("Sell Price cannot be less than $" + snapshot.child("/current_prices/" + current_coin_type).val() + " AUD");
                    this.setState({
                        sellPrice : snapshot.child("/current_prices/" + current_coin_type).val(),
                        sellTotal : snapshot.child("/current_prices/" + current_coin_type).val() *  this.state.sellAmount
                    })
                    return;
                }
            }
        });
        // validate save order
        this.validate_sell = () => {
            this.update_current_price_fb(this.state.pairs, this.state.uid);
            let current_coin_type = this.state.coinType
            const portfolioData = firebase.database().ref('portfolio/' + this.state.uid);
            portfolioData.once('value', (snapshot) => {
                if(snapshot.val() !== null) {
                    for (const index in snapshot.child('assets/').val()){
                        if (index === current_coin_type){
                            const coin_amt = snapshot.child('/assets/' + current_coin_type).val();
                            // Check if there is enough coin for transaction
                            if(coin_amt < this.state.sellAmount){
                                alert('Not Enough Coin');
                                return;
                            }else{
                                // if enough coin, save the order to sell node
                                this.setState({
                                    timestamp: currentTime
                                }, () => {
                                    firebase.database().ref('sell/').push({
                                        price: this.state.sellPrice,
                                        amount: parseInt(this.state.sellAmount),
                                        total: this.state.sellTotal,
                                        user_id: this.state.uid,
                                        process: false,
                                        timestamp: this.state.timestamp,
                                        coinType: this.state.coinType,
                                        coinValue: snapshot.child("/current_prices/" + current_coin_type).val(),
                                        coinTotal: snapshot.child("/current_prices/" + current_coin_type).val() * parseInt(this.state.sellAmount)
                                    }).then(function () {
                                        console.log("Insertion Succeeded.")
                                    }).catch(function (error) {
                                        console.log("Sell Order Insertion Failed: " + error.message)
                                    });
                                    // set UI sell data field to empty
                                    this.setState({
                                        sellAmount: '',
                                        sellPrice: '',
                                        sellTotal: ''
                                    });
                                    alert('Sell order is successfully submitted');
                                });
                            }
                        }
                    }
                }
            });
        }
        this.validate_sell();
        this.retrieve_orders();
    }

    /* Handle input to BuyAmount Field on the UI */
    handleBuyAmountChange(event) {
        // Prevent negative input value
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            buyAmount: event.target.value,
        }, () => this.handleBuyTotalChange());
        // callback function for real time update on Total value
    }

    /* Handle input to BuyPrice Field on the UI */
    handleBuyPriceChange(event) {
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            buyPrice: event.target.value,
        }, () => this.handleBuyTotalChange());
    }

    /* Calculate the buyTotal Field on the UI */
    handleBuyTotalChange() {
        this.setState({
            buyTotal: this.state.buyAmount * this.state.buyPrice
        });
    }

    /* Handle input to SellAmount Field on the UI */
    handleSellAmountChange(event) {
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            sellAmount: event.target.value,
        }, () => this.handleSellTotalChange());
    }

    /* Handle input to SellPrice Field on the UI */
    handleSellPriceChange(event) {
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            sellPrice: event.target.value
        }, () => this.handleSellTotalChange());
    }

    /* Calculate the sellTotal Field on the UI */
    handleSellTotalChange() {
        this.setState({
            sellTotal: this.state.sellAmount * this.state.sellPrice
        });
    }

    /* process order function calls */
    process_orders() {
        this.retrieve_orders();
        this.update_current_price_fb(this.state.pairs, this.state.uid);
        this.process_buy_orders_fb(this.state.buyOrders);
        this.process_sell_orders_fb(this.state.sellOrders);
    }

    render(){
        const { classes } = this.props,{ buyOrders,  current_order, buyPrice, buyAmount, sellPrice, sellAmount } = this.state;
        return(
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 pad-box">
                            <div className="buy-box pull-right">
                                <h2 className="text-center">BUYING</h2>
                                <p>Coin: <span id="selected_coin_buy">{this.state.coinType}</span></p>
                                <p>Price:</p>
                                <form id="transaction" onSubmit={this.save_BuyOrder}>
                                <TextField fullWidth
                                    id="buyPrice"
                                    value={this.state.buyPrice}
                                    onChange={this.handleBuyPriceChange}
                                    type="number"
                                    InputProps={{
                                        disableUnderline: true,
                                        classes: {
                                                    input: classes.bootstrapInput
                                        }
                                           }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                />

                                <p>Amount:</p>
                                    <TextField fullWidth
                                        id="buyAmount"
                                        value={this.state.buyAmount}
                                        onChange={this.handleBuyAmountChange}
                                        type="number"
                                               InputProps={{
                                                   disableUnderline: true,
                                                   classes: {
                                                       input: classes.bootstrapInput
                                                   }
                                               }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <p>Total:</p>
                                <TextField fullWidth
                                    id="buyTotal"
                                    value={this.state.buyTotal}
                                    type="number"
                                           InputProps={{
                                               classes: {
                                                   input: classes.totalInput
                                               }
                                           }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    disabled
                                />
                                <RaisedButton id="buy-button" color="primary" type="submit" >
                                    <h3>Buy</h3>
                                </RaisedButton>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 pad-box">
                            <div className="sell-box pull-left">
                                <h2 className="text-center">SELLING</h2>
                                <p>Coin: <span id="selected_coin_sell">{this.state.coinType}</span></p>
                                <p>Price:</p>
                                <form id="transaction" onSubmit={this.save_SellOrder}>
                                    <TextField fullWidth
                                        id="sellPrice"
                                        value={this.state.sellPrice}
                                        onChange={this.handleSellPriceChange}
                                        type="number"
                                               InputProps={{
                                                   disableUnderline: true,
                                                   classes: {
                                                       input: classes.bootstrapInput
                                                   }
                                               }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <p>Amount:</p>
                                    <TextField fullWidth
                                        id="sellAmount"
                                        value={this.state.sellAmount}
                                        onChange={this.handleSellAmountChange}
                                        type="number"
                                               InputProps={{
                                                   disableUnderline: true,
                                                   classes: {
                                                       input: classes.bootstrapInput
                                                   }
                                               }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <p>Total:</p>
                                <TextField fullWidth
                                    id="sellTotal"
                                    value={this.state.sellTotal}
                                    type="number"
                                           InputProps={{
                                               classes: {
                                                   input: classes.totalInput
                                               }
                                           }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    disabled
                                />
                                <RaisedButton id="sell-button" color="secondary" type="submit" >
                                    <h3>Sell</h3>
                                </RaisedButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withStyles(styles)(Transaction);
