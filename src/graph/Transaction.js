import React, { Component } from 'react';
import './Transaction.css';
import RaisedButton from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import firebase from "firebase/index";
import { withStyles} from 'material-ui/styles';
import { app } from "../Constant";

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

export default withStyles(styles)(class Transaction extends Component{

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
            coinType: 'BTC',
            uid: null
        }

        this.handleBuyPriceChange = this.handleBuyPriceChange.bind(this);
        this.handleBuyAmountChange = this.handleBuyAmountChange.bind(this);
        this.handleSellPriceChange = this.handleSellPriceChange.bind(this);
        this.handleSellAmountChange = this.handleSellAmountChange.bind(this);
        this.loadTimestamp = this.loadTimestamp.bind(this);

        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.save_BuyOrder = this.save_BuyOrder
    }

    componentDidMount(){

        this.removeAuthListener = app.auth().onAuthStateChanged((user) => {
            if(user) {
                this.setState({ authenticated : true })
            } else {
                this.setState({ authenticated: false })
            }
        });

        this.loadUserID();
        this.retrieve_currentPrice();
        // this.retrieve_orders();
        // this.process_orders();
    }



    componentWillReceiveProps(props){
        if (props.coin != this.state.coinType){
            this.setState({
                coinType : props.coin
            }, () => this.retrieve_currentPrice());
        }
    }

    loadUserID = () => {
        var authData = firebase.auth().currentUser;
        if (authData) {
            this.setState({
                uid : authData.uid
            })
        }
    }

    retrieve_currentPrice = () => {
        this.getData = () => {
            // filter coin, pass coin from chart
            const coin = this.state.coinType;
            const currency = 'AUD';
            const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + currency;

            fetch(url).then(r => r.json())
                .then((coinData) => {
                    const price = coinData.AUD;

                    this.setState({
                        // coinType: coin,
                        currentPrice: coinData.AUD,
                        updatedAt: new Date()
                    })
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        this.getData();
        this.refresh = setInterval(() => this.getData(), 90000);
        this.retrieve_orders();
    }

    loadTimestamp(event){
        var moment = require('moment');
        var currentTime = moment();
        currentTime = currentTime.format();
        console.log('current timestamp: ' + currentTime);
        this.setState({
            timestamp: currentTime
        });
        event.preventDefault();
    }

    save_BuyOrder = (event) => {
        // this.loadTimestamp(event);
        // this.loadTimestamp(event).then(() => {
        event.preventDefault();
        var moment = require('moment');
        var currentTime = moment();
        currentTime = currentTime.format();
        console.log('current timestamp: ' + currentTime);
        if (this.state.buyTotal == null || 0){
            alert("Buy Total is 0!");
            return;
        }

        this.setState({
            timestamp: currentTime
        }, () => {
            console.log('current timestamp in save_BuyOrder: ' + this.state.timestamp);
            firebase.database().ref('buy/').push({
                price: parseInt(this.state.buyPrice),
                amount: parseInt(this.state.buyAmount),
                total: this.state.buyTotal,
                user_id: this.state.uid,
                process: false,
                timestamp: this.state.timestamp,
                coinType: this.state.coinType,
                coinValue: this.state.currentPrice,
                coinTotal: this.state.currentPrice * parseInt(this.state.buyAmount)
            }).then(function () {
                console.log("Insertion Succeeded.")
            }).catch(function (error) {
                console.log("Buy Order Insertion Failed: " + error.message)
            });
            this.setState({
                buyAmount: '',
                buyPrice: '',
                buyTotal: ''
            });
            alert('Buy order is successfully submitted');
        });

    }

    save_SellOrder = (event) => {
        event.preventDefault();
        var moment = require('moment');
        var currentTime = moment();
        currentTime = currentTime.format();
        console.log('current timestamp: ' + currentTime);
        if (this.state.sellTotal == null ||
            this.state.sellTotal == 0){
            alert("Sell Total is 0!");
            return;
        }
        if (this.state.sellPrice < this.state.currentPrice){
            alert("Sell Price cannot be less than $" + this.state.currentPrice + " AUD");
            this.setState({
                sellPrice : this.state.currentPrice,
                sellTotal : this.state.currentPrice *  this.state.sellAmount
            })
            return;
        }

        this.setState({
            timestamp: currentTime
        }, () => {
            firebase.database().ref('sell/').push({
                price: parseInt(this.state.sellPrice),
                amount: parseInt(this.state.sellAmount),
                total: this.state.sellTotal,
                user_id: this.state.uid,
                process: false,
                timestamp: this.state.timestamp,
                coinType: this.state.coinType,
                coinValue: this.state.currentPrice,
                coinTotal: this.state.currentPrice * parseInt(this.state.sellAmount)
            }).then(function () {
                console.log("Insertion Succeeded.")
            }).catch(function (error) {
                console.log("Sell Order Insertion Failed: " + error.message)
            });
            this.setState({
                sellAmount: '',
                sellPrice: '',
                sellTotal: ''
            });
            alert('Sell order is successfully submitted');
        });
    }

    retrieve_orders = () => {
        // get api value for various crypto values
        // if buy/sell order reach specified amount, process it
        // loop all orders and process it
        const assignedBuyOrder = [];
        const assignedSellOrder = [];
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
                this.process_orders("buy");
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
                this.process_orders("sell");
            }
        });

    }

    process_orders = (type) => {
        const buyOrderLists = this.state.buyOrders;
        const sellOrderLists = this.state.sellOrders;
        const btc_price = this.state.currentPrice;
        // console.log('bitcoin price= ' + btc_price);
        // console.log('buy orderLists: ' + buyOrderLists);
        // console.log('sell orderLists: ' + sellOrderLists);
        if (type === "buy") {
            console.log("Buy Iteration");
            for (const index in buyOrderLists) {
                // console.log('price: ' + orderLists[index]["price"]);
                if (btc_price <= buyOrderLists[index]["price"]) {
                    // console.log('user price= ' + buyOrderLists[index]["price"]);
                    // console.log('bitcoin price= ' + btc_price);
                    // process the money:
                    // deduct money from user's balance and increase their btc coin
                    var buy_total = buyOrderLists[index]["total"];
                    var buy_amount = buyOrderLists[index]["amount"];
                    var uid = buyOrderLists[index]["user_id"];
                    // this.handleUserTransaction(uid, buy_total, buy_amount, "buy");

                    const user = firebase.database().ref('user/' + uid);
                    user.on('value', (snapshot) => {
                        var final_user_coin = null;
                        var final_user_balance = null;
                        if (snapshot.val() !== null) {
                            var user_coin = snapshot.child("/coin/" + this.state.coinType).val();
                            var user_balance = snapshot.child("/coin/balance").val();
                            // console.log("user_coin: " + user_coin);
                            // console.log("user_balance: " + user_balance);
                            final_user_coin = user_coin + buy_amount;
                            final_user_balance = user_balance - buy_total;

                            var oid = null;
                            var status = null;
                            const buyOrderFB = firebase.database().ref('buy/');
                            buyOrderFB.on('value', (snapshot) => {
                                if(snapshot.val() !== null){

                                    for(const indexJ in snapshot.val()){
                                        // console.log("indexJ " + indexJ);

                                        if (indexJ === buyOrderLists[index]["id"] ){
                                            oid = indexJ;
                                            status = snapshot.child(indexJ +"/process").val()
                                        }
                                    }
                                }
                            });
                            // console.log("oid " + oid);
                            // console.log("status " + status);
                            if (status === false) {

                                var updates = {};
                                updates['user/' + uid + '/coin/' + this.state.coinType] = final_user_coin;
                                updates['user/' + uid + '/coin/balance'] = final_user_balance;

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
                                        // then remove the processed transaction
                                        const processed_transaction = firebase.database().ref('buy/' + oid + '/');
                                        processed_transaction.remove();

                                    }
                                });
                            }

                        }
                    });
                }
            }

        }else if (type === "sell"){
            console.log("Sell Iteration");
            for(const index in sellOrderLists){

                if (btc_price >= sellOrderLists[index]["price"]){

                    var sell_total = sellOrderLists[index]["total"];
                    var sell_amount = sellOrderLists[index]["amount"];
                    var uid = sellOrderLists[index]["user_id"];
                    // this.handleUserTransaction(uid, buy_total, buy_amount, "buy");

                    const user = firebase.database().ref('user/' + uid);
                    user.on('value', (snapshot) => {
                        var final_user_coin = null;
                        var final_user_balance = null;
                        if (snapshot.val() !== null) {
                            var user_coin = snapshot.child("/coin/" + this.state.coinType).val();
                            var user_balance = snapshot.child("/coin/balance").val();
                            // console.log("user_coin: " + user_coin);
                            // console.log("user_balance: " + user_balance);
                            final_user_coin = user_coin - sell_amount;
                            final_user_balance = user_balance + sell_total;

                            var oid = null;
                            var status = null;
                            const sellOrderFB = firebase.database().ref('sell/');
                            sellOrderFB.on('value', (snapshot) => {
                                if(snapshot.val() !== null){

                                    for(const indexJ in snapshot.val()){
                                        // console.log("indexJ " + indexJ);

                                        if (indexJ === sellOrderLists[index]["id"] ){
                                            oid = indexJ;
                                            status = snapshot.child(indexJ +"/process").val()
                                        }
                                    }
                                }
                            });
                            // console.log("oid " + oid);
                            // console.log("status " + status);
                            if (status === false) {
                                var updates = {};
                                updates['user/' + uid + '/coin/' + this.state.coinType] = final_user_coin;
                                updates['user/' + uid + '/coin/balance'] = final_user_balance;

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
                                        // then remove the processed transaction
                                        const processed_transaction = firebase.database().ref('sell/' + oid + '/');
                                        processed_transaction.remove();

                                    }
                                });

                            }

                        }
                    });
                }
            }
        }
    }



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

    handleBuyPriceChange(event) {
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            buyPrice: event.target.value,
        }, () => this.handleBuyTotalChange());
    }

    handleBuyTotalChange = () => {
        this.setState({
            buyTotal: this.state.buyAmount * this.state.buyPrice
        });
    }

    handleSellAmountChange(event) {
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            sellAmount: event.target.value,
        }, () => this.handleSellTotalChange());
    }
    handleSellPriceChange(event) {
        if(event.target.value < 0) {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            sellPrice: event.target.value
        }, () => this.handleSellTotalChange());
    }

    handleSellTotalChange = () => {
        this.setState({
            sellTotal: this.state.sellAmount * this.state.sellPrice
        });
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
                        <div className="col-md-6 noPad">
                            <div className="sell-box pull-left">
                                <h2 className="text-center">SELLING</h2>
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

)

