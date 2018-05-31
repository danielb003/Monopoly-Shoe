import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import Leaderboard from "../src/leaderboard/Leaderboard";

// import jsdom from 'jsdom'
// const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
// global.document = doc
// global.window = doc.defaultView
describe('Component: Leaderboard', () =>{
    it('tests to be defined', () => {
        expect(Leaderboard).toBeDefined();
    })
    it('tests something on leaderboard', () => {
        let wrapper = shallow(<Leaderboard/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('tests if a AppBar tab exists', () => {
        let wrapper = shallow(<Leaderboard/>);
        //<Tabs value={tabValue} onChange={this.handleTabChange}>
        const fn = jest.fn();
        expect(wrapper.dive().containsAnyMatchingElements([
            <h3>Leaderboard</h3>,
        ])).toEqual(true);
    });

    it('tests if only one table is rendered at a time', () => {
        let wrapper = render(<Leaderboard/>);
        //<Tabs value={tabValue} onChange={this.handleTabChange}>
        const fn = jest.fn();
        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('table').length).toEqual(1);
    });

    it('tests clicking the tab on AppBar', () => {
        // ***Material UI theme complication***
        let wrapper = shallow(<Leaderboard/>);
        const fn = jest.fn();
        wrapper.instance().handleTabChange = jest.fn();
        let handleSubmit = wrapper.instance();
        // expect(handleSubmit).toHaveBeenCalledTimes(0);
        expect(wrapper).toMatchSnapshot();
        // expect(wrapper.find('.table').exists()).toEqual(true);
        // expect(
        //     wrapper.contains(<h3 id='leaderboard'>Leaderboard</h3>)
        // ).toEqual(true);
        expect(
            wrapper.dive().find('h3').prop('id')
        ).toEqual('leaderboard');
    });


});






// check state if amount is empty
//             if price is empty

// check coin state is not empty
//            price is not 0


// firebase test
// test user's transaction for enough balance or enough amount
// test user's buy
// test user's sell