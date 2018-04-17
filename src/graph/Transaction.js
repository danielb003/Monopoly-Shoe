import React, { Component } from 'react';
import './Transaction.css';
import Button from 'material-ui/Button';

class Transaction extends Component{
    render(){
        return(
            <div>
                <div className="container table-bordered">
                    <div className="row">
                        <div className="col-md-6 table-bordered pad-box">
                            <div className="buy-box table-bordered">
                                <h2 className="text-center">BUY</h2>
                                <p>Price</p>
                                <p>Amount</p>
                                <Button id="buy-button" color="primary" >
                                    <h3>Buy</h3>
                                </Button>
                            </div>
                        </div>
                        <div className="col-md-6 table-bordered noPad">
                            <div className="sell-box table-bordered">
                                <h2 className="text-center">SELL</h2>
                                <p>Price</p>
                                <p>Amount</p>
                                <Button id="sell-button" color="secondary" >
                                    <h3>Sell</h3>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Transaction;