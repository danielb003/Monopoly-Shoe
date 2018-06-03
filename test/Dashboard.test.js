import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import { Redirect } from 'react-router-dom'

import Dashboard from '../src/dashboard/Dashboard';

// import jsdom from 'jsdom'
// const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
// global.document = doc
// global.window = doc.defaultView
describe('Component: Dashboard', () =>{
    it('tests to be defined', () => {
        expect(Dashboard).toBeDefined();
    });
    it('tests something on Dashboard', () => {
        let wrapper = shallow(<Dashboard/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('tests redirection to home page if user is authenticated', () => {
        let wrapper = shallow(<Dashboard/>).setState({
            authenticated : false
        });
        expect(wrapper.find('Redirect').prop('to')).toEqual('/');
    });

    it('tests if there are fours tables on the dashboard (Portfolio,OpenBuy,OpenSell,History)', () =>{
        let wrapper = shallow(<Dashboard/>);
        expect(wrapper.find('table').exists()).toEqual(true);
        expect(wrapper.find('table').length).toEqual(4);
    });

    it('tests checking the table headers for portfolio table', () => {
        let wrapper = shallow(<Dashboard/>);
        expect(
            wrapper.contains(
                <tr>
                    <th>Coin</th>
                    <th>Amount</th>
                    <th>Total Cost</th>
                    <th>Total Worth</th>
                    <th>Average Price</th>
                    <th>Current Price</th>
                    <th>Profit/Loss</th>
                </tr>
            )).toEqual(true);
    });

    it('tests checking the table headers for open buy and open sell orders table', () => {
        let wrapper = shallow(<Dashboard/>);
        expect(
            wrapper.contains(
                <tr>
                    <th>Date</th>
                    <th>Coin</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Value</th>
                </tr>
            )).toEqual(true);
    });

    it('tests checking the table headers for history table', () => {
        let wrapper = shallow(<Dashboard/>);
        expect(
            wrapper.contains(
                <tr>
                    <th>Date</th>
                    <th>Coin</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Amount</th>
                    <th>Value</th>
                </tr>
            )).toEqual(true);
    });

    it('tests checking the state for portfolio table', () => {
        let wrapper = shallow(<Dashboard/>).setState({
            coins:[{
                id: '123',
                name: 'john',
                amt: '5',
                cost: '9999',
                totalWorth: '510000',
                averagePrice: '4444',
                currentPrice: '5000',
                profitLoss: '5999'
            }]
        });
        expect(
            wrapper.containsAnyMatchingElements([
                <td>john</td>,
                <td>5</td>,
                <td>9999</td>,
                <td>510000</td>,
                <td>4444</td>,
                <td>5000</td>,
                <td>5999</td>,
            ])).toEqual(true);
    });

    it('tests checking the state for open buy and open sell orders table', () => {
        let wrapper = shallow(<Dashboard/>).setState({
            open_buy_orders:[{
                id: '123',
                timestamp: '2018-04-05T19:20:30.45Z',
                coinType: 'LTC',
                price: '200',
                amount: '2',
                coinValue: '222'
            }],
            open_sell_orders:[{
                id: '123',
                timestamp: '2018-04-05T19:20:30.45Z',
                coinType: 'ETH',
                price: '5000',
                amount: '3',
                coinValue: '5555'
            }]
        });
        expect(
            wrapper.containsAnyMatchingElements([
                <td>2018-04-05T19:20:30.45Z</td>,
                <td>LTC</td>,
                <td>200</td>,
                <td>2</td>,
                <td>222</td>,
            ])).toEqual(true);
        expect(
            wrapper.containsAnyMatchingElements([
                <td>2018-04-05T19:20:30.45Z</td>,
                <td>ETH</td>,
                <td>5000</td>,
                <td>3</td>,
                <td>5555</td>,
            ])).toEqual(true);
    });

    it('tests checking the state for history table', () => {
        let wrapper = shallow(<Dashboard/>).setState({
            history:[{
                id: '123',
                timestamp: '2018-04-06T19:20:30.45Z',
                coinType: 'BTC',
                type: 'Sell',
                price: '10000',
                amount: '5',
                coinValue: '11111'
            }]
        });
        expect(
            wrapper.containsAnyMatchingElements([
                <td>2018-04-06T19:20:30.45Z</td>,
                <td>BTC</td>,
                <td>Sell</td>,
                <td>10000</td>,
                <td>5</td>,
                <td>11111</td>,
            ])).toEqual(true);
    });


});

