import React, { Component } from 'react';
import './Transaction.css';
// import Button from 'material-ui/Button';
import firebase from 'firebase';
import Button from 'react-bootstrap-form';

class Transaction extends Component{

    state = {
        orders: [],
        current_order: null,
        price: null,
        amount: null,
        value: 'e'
    }



    save_BuyOrder = () => {
        const toSend_data = {};
        toSend_data['buy-order/' + this.state.current_order.id] = {
            ticket_id: this.state.selected_ticket.id,
            // user_id: this.state.selected_techuser,
            price: this.state.price,
            amount: this.state.amount
        }
        firebase.database().ref().update(toSend_data);
    }

    save_SellOrder = () => {
        // const toSend_data = {};
        // toSend_data['sell-order/'] = {
        //     // id: this.state.current_order.id,
        //     // user_id: this.state.selected_techuser,
        //     price: this.state.price,
        //     amount: this.state.amount
        // }
        // firebase.database().ref().set(toSend_data);
        firebase.database().ref('sell-order/2').set({
            price: 50,
            amount: 100
            // profile_picture : imageUrl
        });
    }

    process_order = () => {
        // get api value for various crypto values
        // if buy/sell order reach specified amount, process it
        // loop all orders and process it
        // for(const index in responseJson) {
        //     firebase.database().ref('buy-order/' + responseJson[index].id).on('value', (snapshot) => {
        //
        //         if(snapshot.val() === null){
        //             // pendingTickets.push(responseJson[index]);
        //
        //
        //             this.forceUpdate();
        //         }
        //     })
        // }
    }

    handleChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    handleSubmit(event) {
        alert('An order was submitted: ' + this.state.value);
        event.preventDefault();
    }

    render(){

        const { orders,  current_order, price, amount } = this.state
        return(
            <div>
                {/* check user auth status, if true show this else hide it*/}

                <div className="container table-bordered">
                    <div className="row">
                        <div className="col-md-6 table-bordered pad-box">
                            <div className="buy-box table-bordered">
                                <h2 className="text-center">BUY</h2>
                                <p>Price</p>
                                <p>Amount</p>
                                {/*<Button id="buy-button" color="primary" >*/}
                                {/*<input type="text" className="form-control" value={this.state.price}*/}
                                       {/*onChange={this.handleChange}>Price</input>*/}
                                {/*<input type="text" className="form-control" value={this.state.amount}*/}
                                       {/*onChange={this.handleChange}>Amount</input>*/}
                                {/*<input type="submit" className="pull-right" bsStyle="success" style={{padding:12}}*/}
                                        {/*onClick={this.save_BuyOrder}>Buy</input>*/}
                                {/*/!*</Button>*!/*/}
                            </div>
                        </div>
                        <div className="col-md-6 table-bordered noPad">
                            <div className="sell-box table-bordered">
                                <h2 className="text-center">SELL</h2>
                                <p>Price</p>
                                <input type="text" className="form-control" value={this.state.price}
                                       onChange={this.handleChange.bind(this)}></input>
                                <p>Amount</p>
                                <input type="text" className="form-control" value={this.state.amount}
                                       onChange={this.handleChange.bind(this)}></input>


                                {/*<Button id="sell-button" color="secondary" onClick={this.save_SellOrder} />*/}

                                <input type="submit" className="pull-right" bsStyle="success" style={{padding:12}}
                                        onClick={this.save_SellOrder}></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default Transaction;