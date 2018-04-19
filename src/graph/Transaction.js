import React, { Component } from 'react';
import './Transaction.css';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import firebase from "firebase/index";


// const config = {
//     apiKey: "AIzaSyAvWYiVSH2CzepYSANoe-1T_7tA9hrIQAQ",
//     authDomain: "programming-project-01-3438e.firebaseapp.com",
//     databaseURL: "https://programming-project-01-3438e.firebaseio.com",
//     projectId: "programming-project-01-3438e",
//     storageBucket: "programming-project-01-3438e.appspot.com",
//     messagingSenderId: "141480863825"
// };

const config = {
    apiKey: "AIzaSyCuWJ1oii7W52PvVUvGZjl03FuavxApXdE",
    authDomain: "pp1-project-5de58.firebaseapp.com",
    databaseURL: "https://pp1-project-5de58.firebaseio.com",
    projectId: "pp1-project-5de58",
    storageBucket: "pp1-project-5de58.appspot.com",
    messagingSenderId: "909893903732"
};

firebase.initializeApp(config);

class Transaction extends Component{

    constructor(props){

        super(props);
        this.state = {
            currentPrice: null,
            updatedAt: null,
            orders: [],
            current_order: null,
            buyPrice: null,
            sellPrice: null,
            buyAmount: null,
            sellAmount: null
        }

        this.handleBuyPriceChange = this.handleBuyPriceChange.bind(this);
        this.handleBuyAmountChange = this.handleBuyAmountChange.bind(this);
        this.handleSellPriceChange = this.handleSellPriceChange.bind(this);
        this.handleSellAmountChange = this.handleSellAmountChange.bind(this);

        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.save_BuyOrder = this.save_BuyOrder
    }

    componentDidMount(){

        this.retreive_currentPrice();


    }

    retreive_currentPrice = () => {
        this.getData = () => {
            const {data} = this.props;
            const coin = 'BTC'
            const currency = 'AUD'
            const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + currency;

            fetch(url).then(r => r.json())
                .then((coinData) => {
                    const price = coinData.AUD;
                    // const change = price - data[0].y;
                    // const changeP = (price - data[0].y) / data[0].y * 100;

                    this.setState({
                        currentPrice: coinData.AUD,
                        // monthChangeD: change.toLocaleString('en-AU',{ style: 'currency', currency: 'AUD' }),
                        // monthChangeP: changeP.toFixed(2) + '%',
                        updatedAt: new Date()
                    })
                })
                .catch((e) => {
                    console.log(e);
                });
        }
        this.getData();
        this.refresh = setInterval(() => this.getData(), 90000);
    }

    save_BuyOrder = (event) => {
        firebase.database().ref('buy/').push({
            price: this.state.buyPrice,
            amount: this.state.buyAmount
        }).then(function () {
            console.log("Insertion Succeeded.")
        })
            .catch(function (error) {
                console.log("Insertion Failed: " + error.message)
            });
        this.setState({
            buyAmount: '',
            buyPrice: ''
        });
        event.preventDefault();
    }

    save_SellOrder = (event) => {
        firebase.database().ref('sell/').push({
            price: this.state.sellPrice,
            amount: this.state.sellAmount
        }).then(function() {
            console.log("Insertion Succeeded.")
        })
        .catch(function(error) {
            console.log("Insertion Failed: " + error.message)
        });
        this.setState({
            sellAmount: '',
            sellPrice: ''
        });
        event.preventDefault();
    }

    process_order = () => {
        // get api value for various crypto values
        // if buy/sell order reach specified amount, process it
        // loop all orders and process it
        // const assignedOrder = [];
        // const orderFB = firebase.database().ref('buy/');
        //
        //
        // orderFB.on('value', (snapshot) => {
        //     if(snapshot.val() !== null){
        //
        //         for(const index in snapshot.val()){
        //             // if(snapshot.val()[index].type === 'tech') {
        //             //     tempTech.push(snapshot.val()[index]);
        //             // }
        //
        //             // esfr
        //         }
        //         assignedOrder.push({
        //             // id:snapshot[index].id,
        //             amount:snapshot[index].amount,
        //             price:snapshot[index].price
        //         });
        //         // pendingTickets.push(responseJson[index]);
        //         // get apiPrice and currentPrice
        //         // check if api price meet buy price than process it
        //
        //         this.forceUpdate();
        //     }
        // }).then((orders) => {
        //     this.setState({
        //         assignedOrder: orders
        //     });
        // })
        // // for(const index in responseJson) {
        //
        // // }
    }

    handleBuyAmountChange(event) {
        this.setState({
            buyAmount: event.target.value
        });
    }
    handleBuyPriceChange(event) {
        this.setState({
            buyPrice: event.target.value
        });
    }

    handleSellAmountChange(event) {
        this.setState({
            sellAmount: event.target.value
        });
    }
    handleSellPriceChange(event) {
        this.setState({
            sellPrice: event.target.value
        });
    }

    // handleSubmit(event) {
    //     alert('buyPrice: ' + this.state.buyPrice + ', buyAmount: ' + this.state.buyAmount);
    //     alert('sellPrice: ' + this.state.sellPrice + ', sellAmount: ' + this.state.sellAmount);
    //     alert('api_price: ' + this.state.currentPrice);
    //     event.preventDefault();
        // firebase.database().ref('sell/4').set({
        //     price: this.state.price,
        //     amount: this.state.amount
        //     }).then(function() {
        //         console.log("Insertion Succeeded.")
        //     })
        //     .catch(function(error) {
        //         console.log("Insertion Failed: " + error.message)
        //     });
        // const itemsRef = firebase.database().ref('sell-order');
        // const item = {
        //     price: this.state.price,
        //     amount: this.state.amount
        // }
        // itemsRef.push(item);
        // this.setState({
        //     price: '',
        //     amount: ''
        // });
    // }

    render(){

        const { orders,  current_order, buyPrice, buyAmount, sellPrice, sellAmount } = this.state;
        return(
            <div>
                <div className="container table-bordered">
                    <div className="row">
                        <div className="col-md-6 table-bordered pad-box">
                            <div className="buy-box table-bordered">
                                <h2 className="text-center">BUY</h2>
                                <p>Price</p>
                                <form onSubmit={this.save_BuyOrder}>
                                <TextField
                                    id="buyPrice"
                                    label="Price"
                                    value={this.state.buyPrice}
                                    onChange={this.handleBuyPriceChange}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                />
                                <p>Amount</p>
                                    <TextField
                                        id="buyAmount"
                                        label="Amount"
                                        value={this.state.buyAmount}
                                        onChange={this.handleBuyAmountChange}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <Button id="buy-button" color="primary" type="submit" >
                                    <h3>Buy</h3>
                                </Button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 table-bordered noPad">
                            <div className="sell-box table-bordered">
                                <h2 className="text-center">SELL</h2>
                                <p>Price</p>
                                <form onSubmit={this.save_SellOrder}>
                                    <TextField
                                        id="sellPrice"
                                        label="Price"
                                        value={this.state.sellPrice}
                                        onChange={this.handleSellPriceChange}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <p>Amount</p>
                                    <TextField
                                        id="sellAmount"
                                        label="Amount"
                                        value={this.state.sellAmount}
                                        onChange={this.handleSellAmountChange}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <Button id="sell-button" color="secondary" type="submit" >
                                    <h3>Sell</h3>
                                </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Transaction;