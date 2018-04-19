import React, { Component } from 'react';
import './Transaction.css';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';


class Transaction extends Component{

    state = {
        buyPrice: '',
        sellPrice: '',
        buyAmount: '',
        sellAmount: '',

    };

    handleChange = buyPrice => event => {
        this.setState({
            [buyPrice]: event.target.value,
        });
    };




    render(){


        return(
            <div>
                <div className="container table-bordered">
                    <div className="row">
                        <div className="col-md-6 table-bordered pad-box">
                            <div className="buy-box table-bordered">
                                <h2 className="text-center">BUY</h2>
                                <p>Price</p>
                                <form >
                                <TextField
                                    id="buyPrice"
                                    label="Price"
                                    value={this.state.buyPrice}
                                    onChange={this.handleChange('buyPrice')}
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
                                        onChange={this.handleChange('buyAmount')}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <Button id="buy-button" color="primary" >
                                    <h3>Buy</h3>
                                </Button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6 table-bordered noPad">
                            <div className="sell-box table-bordered">
                                <h2 className="text-center">SELL</h2>
                                <p>Price</p>
                                <form >
                                    <TextField
                                        id="sellPrice"
                                        label="Price"
                                        value={this.state.sellPrice}
                                        onChange={this.handleChange('sellPrice')}
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
                                        onChange={this.handleChange('sellAmount')}
                                        type="number"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                    />
                                <Button id="sell-button" color="secondary" >
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