import React, { Component } from 'react';
import moment from 'moment';
import './InfoBox.css';

class InfoBox extends Component {
   render(){
      const firstPrice = this.props.firstPrice;
      const currentPrice = this.props.currentPrice;
      const monthChangeD = this.props.monthChangeD;
      const monthChangeP = this.props.monthChangeP;
      const updatedAt = this.props.updatedAt;
      const coin = this.props.coin;
      const currency = this.props.currency;
      const limitname = this.props.limitname;
      return (
         <div id="data-container">
            { currentPrice ?
               <div id="left" className='box'>
                  <div className="heading">{currentPrice.toLocaleString('en-AU',{ style: 'currency', currency: currency })}</div>
                  <div className="subtext">{'Updated ' + moment(updatedAt ).fromNow()}</div>
               </div>
               : null}
            { currentPrice ?
               <div id="middle" className='box'>
                  <div className="heading">{monthChangeD}</div>
                  <div className="subtext">{coin} ($) Change Since Last {limitname} ({currency})</div>
               </div>
               : null}
            <div id="right" className='box'>
               <div className="heading">{monthChangeP}</div>
               <div className="subtext">{coin} (%) Change Since Last {limitname}</div>
            </div>

         </div>
      );
   }
}

export default InfoBox;