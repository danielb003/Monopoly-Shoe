import React, { Component } from 'react';
import './Transaction.css';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import firebase from "firebase/index";
import { withStyles} from 'material-ui/styles';


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
    }

});


firebase.initializeApp(config);


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
            sellTotal: null
        }

        this.handleBuyPriceChange = this.handleBuyPriceChange.bind(this);
        this.handleBuyAmountChange = this.handleBuyAmountChange.bind(this);
        this.handleSellPriceChange = this.handleSellPriceChange.bind(this);
        this.handleSellAmountChange = this.handleSellAmountChange.bind(this);

        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.save_BuyOrder = this.save_BuyOrder
    }

    componentDidMount(){


        this.retrieve_currentPrice();
        // this.retrieve_orders();
        // this.process_orders();
    }

    retrieve_currentPrice = () => {
        this.getData = () => {
            const {data} = this.props;
            const coin = 'BTC'
            const currency = 'AUD'
            const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + currency;

            fetch(url).then(r => r.json())
                .then((coinData) => {
                    const price = coinData.AUD;

                    this.setState({
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

    save_BuyOrder = (event) => {
        firebase.database().ref('buy/').push({
            price: this.state.buyPrice,
            amount: this.state.buyAmount,
            total: this.state.buyTotal
        }).then(function () {
            console.log("Insertion Succeeded.")
        })
            .catch(function (error) {
                console.log("Insertion Failed: " + error.message)
            });
        this.setState({
            buyAmount: '',
            buyPrice: '',
            buyTotal: ''
        });
        event.preventDefault();
    }

    save_SellOrder = (event) => {
        firebase.database().ref('sell/').push({
            price: this.state.sellPrice,
            amount: this.state.sellAmount,
            total: this.state.sellTotal
        }).then(function() {
            console.log("Insertion Succeeded.")
        })
        .catch(function(error) {
            console.log("Insertion Failed: " + error.message)
        });
        this.setState({
            sellAmount: '',
            sellPrice: '',
            sellTotal: ''
        });
        event.preventDefault();
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
                        total:snapshot.child(index + "/total").val()
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
                        total:snapshot.child(index + "/total").val()
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
        console.log('bitcoin price= ' + btc_price);
        console.log('buy orderLists: ' + buyOrderLists);
        console.log('sell orderLists: ' + sellOrderLists);
        if (type === "buy"){
            console.log("Buy Iteration");
            for(const index in buyOrderLists){
                // console.log('price: ' + orderLists[index]["price"]);
                if (btc_price <= buyOrderLists[index]["price"]){
                    console.log('user price= ' + buyOrderLists[index]["price"]);
                    console.log('bitcoin price= ' + btc_price);
                    // process the money:
                    // deduct money from user's balance and increase their btc coin
                }
            }
        }else if (type === "sell"){
            console.log("Sell Iteration");
            for(const index in sellOrderLists){
                // console.log('price: ' + orderLists[index]["price"]);
                if (btc_price >= sellOrderLists[index]["price"]){
                    console.log('user price= ' + sellOrderLists[index]["price"]);
                    console.log('bitcoin price= ' + btc_price);
                    // process the money:
                    // deduct money from user's balance and increase their btc coin
                }
            }
        }
    }



    handleBuyAmountChange(event) {
        this.setState({
            buyAmount: event.target.value,
        }, () => this.handleBuyTotalChange());
        // callback function for real time update on Total value
    }

    handleBuyPriceChange(event) {
        this.setState({
            buyPrice: event.target.value
        });
    }

    handleBuyTotalChange = () => {
        this.setState({
            buyTotal: this.state.buyAmount * this.state.buyPrice
        });
    }

    handleSellAmountChange(event) {
        this.setState({
            sellAmount: event.target.value,

        }, () => this.handleSellTotalChange());
    }
    handleSellPriceChange(event) {
        this.setState({
            sellPrice: event.target.value
        });
    }

    handleSellTotalChange = () => {
        this.setState({
            sellTotal: this.state.sellAmount * this.state.sellPrice
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

        const { classes } = this.props,{ buyOrders,  current_order, buyPrice, buyAmount, sellPrice, sellAmount } = this.state;
        return(
            <div>
                <div className="container table-bordered">
                    <div className="row">
                        <div className="col-md-6 table-bordered pad-box">
                            <div className="buy-box table-bordered">
                                <h2 className="text-center">BUYING</h2>
                                <p>Price:</p>
                                <form onSubmit={this.save_BuyOrder}>
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
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    disabled
                                />
                                <Button id="buy-button" color="primary" type="submit" >
                                    <h3>Buy</h3>
                                </Button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 table-bordered noPad">
                            <div className="sell-box table-bordered">
                                <h2 className="text-center">SELLING</h2>
                                <p>Price:</p>
                                <form onSubmit={this.save_SellOrder}>
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
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    margin="normal"
                                    disabled
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

)

