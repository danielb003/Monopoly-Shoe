import React, { Component } from 'react';
import Admin from "../src/dashboard/Admin";


describe('Component: Admin', () => {
    it('tests Admin component to be defined', () => {
        expect(Admin).toBeDefined();
    });

    it('tests header saying ADMINISTRATOR', () => {
        let wrapper = shallow(<Admin/>);

        expect(
            wrapper.find("#dashboard").length
        ).toEqual(1);
        expect(
            wrapper.find('.col-md-9').find('h1').text()
        ).toEqual('ADMINISTRATOR');

    });

    it('tests checking that there are two tables(Users, User History) on the page', () => {
        let wrapper = shallow(<Admin/>);

        expect(
            wrapper.find('table').length
        ).toEqual(2);

    });

    it('tests checking that the header of two tables(Users, User History)', () => {
        let wrapper = shallow(<Admin/>);

        expect(
            wrapper.find('table').length
        ).toEqual(2);

    });

    it('tests checking the User table headers and content', () => {
        let wrapper = shallow(<Admin/>).setState({
            all_users : [{
                id:1,
                fname:'hello',
                lname:'world'
            }]
        });

        expect(
            wrapper.contains(
                <thead className="">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Edit User</th>
                    </tr>
                </thead>
            )
        ).toEqual(true);
        expect(
            wrapper.containsAnyMatchingElements([
                    <td>hello</td>,
                    <td>world</td>,
                    <td><a>Go</a></td>
        ])).toEqual(true);
    });


    it('tests checking the User History table headers and content', () => {
        let wrapper = shallow(<Admin/>).setState({
            history :[{
                id: 1,
                amount: '5',
                coinType: 'BTC',
                type: 'Sell',
                price: '12345',
                user_id: '12',
                timestamp: '2018-04-05T19:20:30.45Z',
                coinValue: '12345'
            }]
        });

        expect(
            wrapper.contains(
                <thead className="">
                    <tr>
                        <th>Date</th>
                        <th>Coin</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Amount</th>
                        <th>Value</th>
                    </tr>
                </thead>
            )
        ).toEqual(true);
        expect(
            wrapper.containsAnyMatchingElements([
                <td>5</td>,
                <td>BTC</td>,
                <td>Sell</td>,
                <td>12345</td>,
                <td>12</td>,
                <td>2018-04-05T19:20:30.45Z</td>,
                <td>12345</td>,
        ])).toEqual(true);
    });
});