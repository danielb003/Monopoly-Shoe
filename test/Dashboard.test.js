import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

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

});

