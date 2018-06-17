/*
Jest Testing Setup Page
Author: Panhaseth Heang
Date: 31/05/2018
*/

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });
// Make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.render = render;
global.mount = mount;

// prevent error on fetch syntax during testing
import "babel-polyfill";
import 'isomorphic-fetch';