// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon');

// Require firebase-admin so we can stub out some of its methods.
const admin = require('firebase-admin');
// Require and initialize firebase-functions-test

const test = require('firebase-functions-test')();
import SignUp from '../src/authentication/SignUp';

describe('Cloud Functions', () => {
    let myFunctions, adminInitStub;

    before(() => {

        // stub admin.initializeApp to be a dummy function that doesn't do anything.
        adminInitStub = sinon.stub(admin, 'initializeApp');
        // save the exports inside a namespace called myFunctions.
        myFunctions = require('../src/authentication/SignUp');
    });

    after(() => {
        // Restore admin.initializeApp() to its original method.
        adminInitStub.restore();
        // Do other cleanup tasks.
        test.cleanup();
    });

    describe('User SignUp', () => {
        let oldDatabase;
        before(() => {
            // Save the old database method so it can be restored after the test.
            oldDatabase = admin.database;
        });

        after(() => {
            // Restoring admin.database() to the original method.
            admin.database = oldDatabase;
        });

        it('should test adding user', (done) => {
            const refParam = '/user';
            const pushParam = {
                fname: 'john',
                lname: 'doe',
                email: 'john@doe2.com',
                password: 'abcdef12345'
            };

            const databaseStub = sinon.stub();
            const refStub = sinon.stub();
            const pushStub = sinon.stub();


            Object.defineProperty(admin, 'database', { get: () => databaseStub });
            databaseStub.returns({ ref: refStub });
            refStub.withArgs(refParam).returns({ push: pushStub });
            pushStub.withArgs(pushParam).returns(Promise.resolve({ ref: 'new_ref' }));

            let wrapper = mount(<SignUp/>).setState({
                fname: 'john',
                lname: 'doe',
                email: 'john@doe2.com',
                password: 'abcdef12345'
            });

            // assertion to do

        });
    });

})