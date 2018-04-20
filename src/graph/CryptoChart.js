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
         activePoint: null,
         firstPrice: null,
         currentPrice: null,
         monthChangeD: null,
         monthChangeP: null,
         updatedAt: null,
         coin: "BTC",
         currency: "AUD",
         limit: 30,
         limitname: "Month",
         pairs: [{name: "BTC"},{name: "LTC"},{name: "ETH"},{name: "NULS"},{name: "XRP"},{name: "XMR"},{name: "NEO"},{name: "EOS"}],
         limits: [{name: "2Y", longname: "Two Years", value: 730},{name: "1Y", longname: "Year", value: 365},
         {name: "6M", longname: "6 Months", value: 180},{name: "3M", longname: "Three Months", value: 90},{name: "1M", longname: "Month", value: 30},
         {name: "2W", longname: "Two Weeks", value: 14},{name: "1W", longname: "Week", value: 7},{name: "3D", longname: "Three Days", value: 3}]
      }
   }

   handleChartHover(hoverLoc, activePoint){
      this.setState({
         hoverLoc: hoverLoc,
         activePoint: activePoint
      })
   }
   loadDataIntoChart(){
      const url = 'https://min-api.cryptocompare.com/data/histoday?fsym=' + this.state.coin + '&limit=' + this.state.limit + '&tsym=' + this.state.currency;

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
                        p: coinData.Data[i].close.toLocaleString('en-AU',{ style: 'currency', currency: this.state.currency }),
                        x: count, //previous days
                        y: coinData.Data[i].close // numerical price
                  });   
                  count++;
            }
            this.setState({
                  firstPrice: sortedData[0].y,
                  data: sortedData,
                  fetchingData: false
            })
            })
            .catch((e) => {
            console.log(e);
            });
   }
   loadCurrentPrice() {
        
      const coin = this.state.coin;
      const currency = this.state.currency;
      const firstPrice = this.state.firstPrice ? this.state.firstPrice : 0.01;
      const url = 'https://min-api.cryptocompare.com/data/price?fsym=' + coin + '&tsyms=' + currency;

      fetch(url).then(r => r.json())
      .then((coinData) => {
         const price = coinData.AUD;
         const change = price - firstPrice;
         const changeP = (price - firstPrice) / firstPrice * 100;

         this.setState({
            currentPrice: coinData.AUD,
            monthChangeD: change.toLocaleString('en-AU',{ style: 'currency', currency: currency }),
            monthChangeP: changeP.toFixed(2) + '%',
            updatedAt: new Date()
         })
      })
      .catch((e) => {
         console.log(e);
      });
    }
    loadData()
    {
      this.loadCurrentPrice();
      this.loadDataIntoChart();
    }
   onCoinClick(name){
      this.setState({coin: name});
  }
  onTimeClick(limit, longname){
      this.setState({
            limit: limit,
            limitname: longname
      });
  }
   componentDidMount(){
      this.loadData();
      this.refresh = setInterval(() => this.loadData(), 50);
   }
   componentWillUnmount(){
      clearInterval(this.refresh);
   }
   render() {
      return (
            <div className='container-fluid'>
                  <div className='row'>
                  <div className='text-center'>
                        {this.state.limits.map((pair, index) => <button key={index} onClick={() => this.onTimeClick(pair.value, pair.longname)}>{pair.name}</button>)}
                  </div>
                  </div>  
                  <div className='row'>
                  { !this.state.fetchingData ?
                              <InfoBox firstPrice={this.state.firstPrice} currentPrice={this.state.currentPrice} monthChangeD={this.state.monthChangeD} monthChangeP={this.state.monthChangeP} updatedAt={this.state.updatedAt} coin={this.state.coin} currency={this.state.currency} limitname={this.state.limitname} />
                  : null }
                  </div>
                  <div className='row'>
                  <div className='popup'>
                        {this.state.hoverLoc ? <ToolTip hoverLoc={this.state.hoverLoc} activePoint={this.state.activePoint}/> : null}
                  </div>
                  </div>
                  <div className='row'>
                  <div className='chart text-center'>
                        { !this.state.fetchingData ?
                        <LineChart data={this.state.data} onChartHover={ (a,b) => this.handleChartHover(a,b) }/>
                        : null }
                  </div>
                  </div>
                  <div className='row'>
                  <div className='text-center'>
                        {this.state.pairs.map((pair, index) => <button key={index} onClick={() => this.onCoinClick(pair.name)}>{pair.name}</button>)}
                  </div>
                  </div>  
        </div>
      );
   }
}

export default CryptoChart;