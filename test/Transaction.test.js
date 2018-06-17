/*
Transaction page tests
Author: Panhaseth Heang
Date: 08/06/2018
*/
import React, { Component } from 'react';
import RaisedButton from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Transaction from "../src/graph/Transaction";

describe('Component: Transaction', () =>{

    it('tests to be defined', () => {
        expect(Transaction).toBeDefined();
    });


    it('tests checking the text field for Price on Buy Component', () => {
        let wrapper = shallow(<Transaction/>);
        expect(
            wrapper.dive().find('#transaction').find('#buyPrice').length
        ).toEqual(1);

        expect(
            wrapper.dive().containsAnyMatchingElements([
                <p>Price:</p>,
                <TextField fullWidth
                           id="buyPrice"
                           value={0}
                           onChange={0}
                           type="number"
                           InputProps={{
                               disableUnderline: true,
                               classes: {
                                   input: null
                               }
                           }}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           margin="normal"
                />
            ])
        ).toEqual(true);
    });

    it('tests checking the text field for Amount on Buy Component', () => {
        let wrapper = shallow(<Transaction/>);

        expect(
            wrapper.dive().find('#transaction').find('#buyAmount').length
        ).toEqual(1);

        expect(
            wrapper.dive().containsAnyMatchingElements([
                <p>Amount:</p>,
                <TextField fullWidth
                           id="buyAmount"
                           value={0}
                           onChange={0}
                           type="number"
                           InputProps={{
                               disableUnderline: true,
                               classes: {
                                   input: null
                               }
                           }}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           margin="normal"
                />
            ])
        ).toEqual(true);
    });

    it('tests checking the text field for Total on Buy Component', () => {
        let wrapper = shallow(<Transaction/>);
        expect(
            wrapper.dive().find('#transaction').find('#buyTotal').length
        ).toEqual(1);

        expect(
            wrapper.dive().containsAnyMatchingElements([
                <p>Total:</p>,
                <TextField fullWidth
                           id="buyTotal"
                           value={0}
                           onChange={0}
                           type="number"
                           InputProps={{
                               disableUnderline: true,
                               classes: {
                                   input: null
                               }
                           }}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           margin="normal"
                />
            ])
        ).toEqual(true);
    });

    it('tests checking the text field for Price on Sell Component', () => {
        let wrapper = shallow(<Transaction/>);
        expect(
            wrapper.dive().find('#transaction').find('#sellPrice').length
        ).toEqual(1);

        expect(
            wrapper.dive().containsAnyMatchingElements([
                <p>Price:</p>,
                <TextField fullWidth
                           id="sellPrice"
                           value={0}
                           onChange={0}
                           type="number"
                           InputProps={{
                               disableUnderline: true,
                               classes: {
                                   input: null
                               }
                           }}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           margin="normal"
                />
            ])
        ).toEqual(true);
    });

    it('tests checking the text field for Amount on Sell Component', () => {
        let wrapper = shallow(<Transaction/>);
        expect(
            wrapper.dive().find('#transaction').find('#sellAmount').length
        ).toEqual(1);

        expect(
            wrapper.dive().containsAnyMatchingElements([
                <p>Amount:</p>,
                <TextField fullWidth
                           id="sellAmount"
                           value={0}
                           onChange={0}
                           type="number"
                           InputProps={{
                               disableUnderline: true,
                               classes: {
                                   input: null
                               }
                           }}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           margin="normal"
                />
            ])
        ).toEqual(true);
    });

    it('tests checking the text field for Total on Sell Component', () => {
        let wrapper = shallow(<Transaction/>);
        expect(
            wrapper.dive().find('#transaction').find('#sellTotal').length
        ).toEqual(1);

        expect(
            wrapper.dive().containsAnyMatchingElements([
                <p>Total:</p>,
                <TextField fullWidth
                           id="sellTotal"
                           value={0}
                           onChange={0}
                           type="number"
                           InputProps={{
                               disableUnderline: true,
                               classes: {
                                   input: null
                               }
                           }}
                           InputLabelProps={{
                               shrink: true,
                           }}
                           margin="normal"
                />
            ])
        ).toEqual(true);
    });

    it('tests checking the buttons for Buy and Sell', () => {
        let wrapper = shallow(<Transaction/>);
        expect(
            wrapper.dive().contains(
                <RaisedButton id="buy-button" color="primary" type="submit" >
                    <h3>Buy</h3>
                </RaisedButton>
            )
        ).toEqual(true);
        expect(
            wrapper.dive().contains(
                <RaisedButton id="sell-button" color="secondary" type="submit" >
                    <h3>Sell</h3>
                </RaisedButton>
            )
        ).toEqual(true);
    });

})

