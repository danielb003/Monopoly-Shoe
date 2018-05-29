import React, { Component } from 'react';
// import { shallow, configure, mount, render } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme Adapter
// configure({adapter: new Adapter()});

import Leaderboard from "../src/leaderboard/Leaderboard";
// import { expect } from 'chai';

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
    })
})



// check state if amount is empty
//             if price is empty

// check coin state is not empty
//            price is not 0


// firebase test
// test user's transaction for enough balance or enough amount
// test user's buy
// test user's sell