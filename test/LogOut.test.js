import LogOut from "../src/authentication/Logout";
import React, { Component } from 'react';


describe('Component: LogOut', () => {

    it('tests LogOut component to be defined', () => {
        expect(LogOut).toBeDefined();
    });


    it('tests redirection to home page', () => {
        let wrapper = shallow(<LogOut/>).setState({
            redirect: true
        });

        expect(
            wrapper.find('Redirect').prop('to')
        ).toEqual('/');

        wrapper = shallow(<LogOut/>).setState({
            redirect: false
        });

        expect(
            wrapper.find('Redirect').exists()
        ).toEqual(false);

    });

    it('tests checking "Logging Out..." message on the page', () =>{
        let wrapper = shallow(<LogOut/>);

        expect(
            wrapper.find('h3').prop('style')
        ).toEqual({"color": "rgb(220,220,220"});

        expect(
            wrapper.find('h3').text()
        ).toEqual('Logging Out...');
    });

});