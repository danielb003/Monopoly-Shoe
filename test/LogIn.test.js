import React, { Component } from 'react';
import LogIn from "../src/authentication/Login";

describe('Component: LogIn', () => {
    it('tests LogIn component to be defined', () => {
        expect(LogIn).toBeDefined();
    });

    it('tests redirect state if true, send user to loading page', () => {
        let wrapper = shallow(<LogIn/>).setState({
            redirect: true
        });
        expect(wrapper.find('Redirect').prop('to')).toEqual('/loading');
    });

    it('tests checking text field for username', () => {
        let wrapper = shallow(<LogIn/>);
        expect(
            wrapper.find("#input_div").find("#login-email").length
        ).toEqual(1);

        expect(
            wrapper.find("#help-block-1").length
        ).toEqual(1);

        expect(
            wrapper.containsAnyMatchingElements([
                <input
                    id="login-email"
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Email"/>
            ])
        ).toEqual(true);
    });

    it('tests checking text field for password', () => {
        let wrapper = shallow(<LogIn/>);
        expect(
            wrapper.find("#input_div").find("#login-password").length
        ).toEqual(1);

        expect(
            wrapper.find("#help-block-2").length
        ).toEqual(1);

        expect(
            wrapper.containsAnyMatchingElements([
                <input
                    id="login-password"
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="Password"/>
            ])
        ).toEqual(true);

    });

    it('tests checking the submit button', () => {
        let wrapper = shallow(<LogIn/>);
        expect(
            wrapper.find("#login-submit").length
        ).toEqual(1);
    });


});