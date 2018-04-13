import React, { Component } from 'react';
import './CryptoChart.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';

class CryptoChart extends Component {
   constructor(props) {
      super(props);
      this.state = {
         fetchingData: true,
         data: null,
         hoverLoc: null,
         activePoint: null
      }
   }
   handleChartHover(hoverLoc, activePoint){
      this.setState({
         hoverLoc: hoverLoc,
         activePoint: activePoint
      })
   }
   componentDidMount(){
      const getData = () => {
         const coin = 'BTC'
         const limit = 365
         const currency = 'AUD'
         const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + coin + '&limit=' + limit + '&tsym=' + currency;

         fetch(url).then( r => r.json())
            .then((coinData) => {
               const sortedData = [];
               let count = 0;

               for (let i in coinData.Data){
                  // Create a new JavaScript Date object based on the timestamp
                  // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                  var date = new Date(coinData.Data[i].time*1000);
                  sortedData.push({
                     d: date.toDateString(),
                     p: coinData.Data[i].close.toLocaleString('en-AU',{ style: 'currency', currency: currency }),
                     x: count, //previous days
                     y: coinData.Data[i].close // numerical price
                  });
                  count++;
               }
               this.setState({
                  data: sortedData,
                  fetchingData: false
               })
            })
            .catch((e) => {
               console.log(e);
            });
      }
      getData();
   }
   render() {
      return (

         <div className='container-fluid'>
            <div className='row'>
               { !this.state.fetchingData ?
                  <InfoBox data={this.state.data} />
                  : null }
            </div>
            <div className='row'>
               <div className='popup'>
                  {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
               </div>
            </div>
            <div className='row'>
               <div className='chart'>
                  { !this.state.fetchingData ?
                     <LineChart data={this.state.data} onChartHover={ (a,b) => this.handleChartHover(a,b) }/>
                     : null }
               </div>
            </div>
         </div>

      );
   }
}

export default CryptoChart;