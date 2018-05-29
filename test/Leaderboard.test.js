import React, { Component } from 'react';
import { shallow, configure, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme Adapter
configure({adapter: new Adapter()});


import { Board } from "../src/leaderboard/Leaderboard";
// import { expect } from 'chai';

// import jsdom from 'jsdom'
// const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
// global.document = doc
// global.window = doc.defaultView

// test('render a label', () => {
//     const wrapper = shallow(
//         <Board/>
//     );
//     expect(wrapper).toMatchSnapshot();
// });

describe('Component: Leaderboard', () =>{
    it('tests something on leaderboard', () => {
        let wrapper;

        // beforeEach(() => { wrapper = shallow(<Board/>);});

        beforeEach(() => {
            wrapper = shallow(<Board/>);
        });
        expect(wrapper).toMatchSnapshot();
        // expect(wrapper.find({ sellTotal: null })).to.have.length(0);
        // const wrapper = shallow((
        //     <div>
        //         <div data-foo="foo" data-bar="bar">Hello</div>
        //     </div>
        // ));
        // expect(wrapper.contains(<div data-foo="foo" data-bar="bar">Hello</div>)).to.equal(true);
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