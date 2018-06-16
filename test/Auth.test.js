import Auth from "../src/authentication/Auth";
import SignUp from "../src/authentication/SignUp";
import Login from "../src/authentication/Login";
import React, { Component } from 'react';


describe('Component: Auth', () => {

    it('tests Auth component to be defined', () => {
        expect(Auth).toBeDefined();
    });

    it('tests checking tabs for login and signup', () => {
        let wrapper = shallow(<Auth/>);
        expect(
            wrapper.find('#tabs').find('#login_tab').text()
        ).toEqual('Log In');
        expect(
            wrapper.find('#tabs').find('#signup_tab').text()
        ).toEqual('Sign Up');
    });

    it('tests header of the authentication container', () => {
        let wrapper = shallow(<Auth/>);

        expect(
            wrapper.find('#auth_box').find("#auth_logo").text()
        ).toEqual('Prolific Trading');
    });

    it('tests displaying Login Component', () => {
        let wrapper = shallow(<Auth/>).setState({
            type : 'login'
        });

        expect(
            wrapper.contains(<Login/>)
        ).toEqual(true);
        expect(
            wrapper.contains(<SignUp/>)
        ).toEqual(false);
    });

    it('tests displaying SignUp Component', () => {
        let wrapper = shallow(<Auth/>).setState({
            type : 'signup'
        });
        expect(
            wrapper.contains(<SignUp/>)
        ).toEqual(true);
        expect(
            wrapper.contains(<Login/>)
        ).toEqual(false);
    });





});