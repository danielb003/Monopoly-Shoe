/*
SignUp page tests
Author: Panhaseth Heang
Date: 16/06/2018
*/
import SignUp from "../src/authentication/SignUp";
import React, { Component } from 'react';

describe('Component: SignUp', () => {

    it('tests SignUp component to be defined', () => {
        expect(SignUp).toBeDefined();
    });


    it('tests checking the firstname field', () => {
        let wrapper = shallow(<SignUp/>);

        expect(
            wrapper.containsAnyMatchingElements([
                <input
                    id="firstname"
                    type="text"
                    name="fname"
                    placeholder="Enter first name"/>,
                <span id="help-block-1"/>
            ])
        ).toEqual(true);
    });

    it('tests checking the lastname field', () => {
        let wrapper = shallow(<SignUp/>);

        expect(
            wrapper.containsAnyMatchingElements([
                <input
                    id="lastname"
                    type="text"
                    name="lname"
                    placeholder="Enter last name"/>,
                <span id="help-block-1"/>
            ])
        ).toEqual(true);
    });

    it('tests checking the email field', () => {
        let wrapper = shallow(<SignUp/>);

        expect(
            wrapper.containsAnyMatchingElements([
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter email"/>,
                <span id="help-block-1"/>
            ])
        ).toEqual(true);
    });

    it('tests checking the firstname field', () => {
        let wrapper = shallow(<SignUp/>);

        expect(
            wrapper.containsAnyMatchingElements([
                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter password"/>,
                <span id="help-block-1"/>
            ])
        ).toEqual(true);
    });

    it('tests redirect to dashboard', () => {
        let wrapper = shallow(<SignUp/>).setState({
            redirect : true
        });

        expect(
            wrapper.find('Redirect').prop('to')
        ).toEqual('/dashboard');

    });

});