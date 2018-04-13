import React, { Component } from 'react';
import moment from 'moment';
import './InfoBox.css';

class InfoBox extends Component {
   constructor(props) {
      super(props);
      this.state = {
         currentPrice: null,
         monthChangeD: null,
         monthChangeP: null,
         updatedAt: null
      }
   }
   componentDidMount(){
      this.getData = () => {
         const {data} = this.props;
         const coin = 'BTC'
         const currency = 'AUD'
         const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + currency;

         fetch(url).then(r => r.json())
            .then((coinData) => {
               const price = coinData.AUD;
               const change = price - data[0].y;
               const changeP = (price - data[0].y) / data[0].y * 100;

               this.setState({
                  currentPrice: coinData.AUD,
                  monthChangeD: change.toLocaleString('en-AU',{ style: 'currency', currency: 'AUD' }),
                  monthChangeP: changeP.toFixed(2) + '%',
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
   componentWillUnmount(){
      clearInterval(this.refresh);
   }
   render(){
      return (
         <div id="data-container">
            { this.state.currentPrice ?
               <div id="left" className='box'>
                  <div className="heading">{this.state.currentPrice.toLocaleString('en-AU',{ style: 'currency', currency: 'AUD' })}</div>
                  <div className="subtext">{'Updated ' + moment(this.state.updatedAt ).fromNow()}</div>
               </div>
               : null}
            { this.state.currentPrice ?
               <div id="middle" className='box'>
                  <div className="heading">{this.state.monthChangeD}</div>
                  <div className="subtext">Change Since Last Month (AUD)</div>
               </div>
               : null}
            <div id="right" className='box'>
               <div className="heading">{this.state.monthChangeP}</div>
               <div className="subtext">Change Since Last Month (%)</div>
            </div>

         </div>
      );
   }
}

export default InfoBox;