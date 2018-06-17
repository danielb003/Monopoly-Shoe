/*
Leaderboard page tests
Author: Panhaseth Heang
Date: 03/06/2018
*/

import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Leaderboard from "../src/leaderboard/Leaderboard";

describe('Component: Leaderboard', () =>{
    it('tests to be defined', () => {
        expect(Leaderboard).toBeDefined();
    })
    it('tests matching snapshot on leaderboard', () => {
        let wrapper = shallow(<Leaderboard/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('tests if the four filtering tabs exists', () => {
        let wrapper = shallow(<Leaderboard/>);
        expect(wrapper.dive().containsAllMatchingElements([
            <AppBar>
                <Tabs>
                    <Tab />
                    <Tab />
                    <Tab />
                    <Tab />
                </Tabs>
            </AppBar>
        ])).toEqual(true);
        expect(wrapper.dive().contains(
           <Tab label="24 HRS" size='large'/>,
           <Tab label="1 Week" />,
           <Tab label="1 Month" />,
           <Tab label="All Times" />,
        )).toEqual(true);
    });

    it('tests if only one table is rendered at a time', () => {
        let wrapper = shallow(<Leaderboard/>);
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.dive().find('table').exists()).toEqual(true);
        expect(wrapper.dive().find('table').length).toEqual(1);
    });

    it('tests checking the table header if include Rank, Trader Name, Trades, Profit', () => {
        let wrapper = shallow(<Leaderboard/>).setState({
            user:   [{
                uid: 'test_id123',
                fname: 'test_firstname',
                lname: 'test_lastname',
                trade: 1,
                profitLoss: '10'
            }],
            tabValue : 0
        });
        expect(wrapper.state('tabValue')).toEqual(0);
        expect(wrapper.dive().containsAnyMatchingElements([
            <h2>No Data within 24 hours</h2>,
            <th>Rank</th>,
            <th>Trader Name</th>,
            <th>Trades</th>,
            <th>Profit</th>,
            <td>test_firstname</td>,
            <td>test_lastname</td>,
            <td>1</td>,
            <td>10</td>,
        ])).toEqual(true);
    });

    it('tests checking the heading label of leaderboard', () => {
        let wrapper = shallow(<Leaderboard/>);
        expect(
            wrapper.dive().find('h3').prop('id')
        ).toEqual('leaderboard');
        expect(
            wrapper.dive().contains(<h3 id='leaderboard'>Leaderboard</h3>)
        ).toEqual(true);
        expect(
            wrapper.dive().containsAnyMatchingElements([
            <h3>Leaderboard</h3>,
            ])
        ).toEqual(true);

    });

    it('tests checking that the table has no data within 24 hours', () => {
        let wrapper = shallow(<Leaderboard/>);
        expect(
            wrapper.dive().contains(<h2>No Data within 24 hours</h2>)
        ).toEqual(true);
    });




    // it('tests clicking \'1 Week\' tab among the four tabs', () => {
    //     // ***Material UI theme complication***
    //
    //     const fn = jest.fn();
    //     // wrapper.instance().handleTabChange = jest.fn();
    //     // let handleSubmit = wrapper.instance();
    //     // expect(handleSubmit).toHaveBeenCalledTimes(0);
    //     // expect(wrapper).toMatchSnapshot();
    //
    //     const event = {
    //         tabValue: { value: '1' }
    //     };
    //     let wrapper = shallow(<Leaderboard />).setState({
    //         tabValue : 1
    //     });
    //     // wrapper.dive().find('Tab').prop('label').toEqual('1 Week').simulate('click', event);
    //     // wrapper.dive().findWhere(n => n.text().includes("label")).simulate('click', event);
    //     // wrapper.dive().find('.MuiButtonBase-root-58').simulate('click', event);
    //     // wrapper.find('.MuiButtonBase-root-58').simulate('click', event);
    //         //.simulate('click', event);
    //     // expect(fn).toBeCalledWith('1');
    //     // expect(
    //     //     wrapper.dive().contains(<h2>No Data within 1 week</h2>)
    //     // ).toEqual(true);
    // });


});