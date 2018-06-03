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

});

