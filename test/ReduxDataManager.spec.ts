import { expect } from "chai";
import ReduxDataManager from "../src/server/ReduxDataManager";

describe('ReduxDataManager', () => {
    it('notifies upon data changes' , (done) => {
        const D = ReduxDataManager({
            actions: 'number'
        }, {
            actions: 0
        });
        D.subscribe(() => {
            try {
                expect(D.getState().actions).to.equal(2);
                done();
            }
            catch (e) {
                done(e);
            }
        });
        D.dispatch({
            type: "ACTION_SET",
            key: 'actions',
            value: 2
        });
    });
    it('has helper functions for each key', (done) => {
        const D = ReduxDataManager({
            actions: 'number'
        }, {
            actions: 0
        });
        D.subscribe(() => {
            try {
                expect(D.getState().actions).to.equal(2);
                expect(D.actions).to.equal(2);
                done();
            }
            catch (e) {
                done(e);
            }
        });
        D.actions = 2;
    });
    it('replaces state', (done) => {
        const D = ReduxDataManager({
            actions: 'number'
        }, {
            actions: 0
        });
        D.subscribe(() => {
            try {
                expect(D.getState().actions).to.equal(2);
                expect(D.state).to.deep.equal({
                    actions: 2
                });
                expect(D.actions).to.equal(2);
                done();
            }
            catch (e) {
                done(e);
            }
        });
        D.state = {
            actions: 2
        };
    });
    it('deep watches objects', (done) => {
        const D = ReduxDataManager({
            playArea: ['string']
        }, {
            playArea: []
        });
        D.subscribe(() => {
            try {
                expect(D.getState().playArea).to.deep.equal(['copper']);
                done();
            }
            catch (e) {
                done(e);
            }
        });
        D.playArea[0] = 'copper';
    });
    it('watches very deep objects', (done) => {
        const D = ReduxDataManager({
            test1: {
                test2: {
                    test3: {
                        test4: 'string'
                    }
                }
            }
        }, {
            test1: {
                test2: {
                    test3: {
                        test4: 'hello'
                    }
                }
            }
        });
        D.subscribe(() => {
            try {
                expect(D.getState()).to.deep.equal({
                    test1: {
                        test2: {
                            test3: {
                                test4: 'changed'
                            }
                        }
                    }
                });
                expect(D.test1.test2.test3.test4).to.equal('changed');
                done();
            }
            catch (e) {
                done(e);
            }
        });
        D.test1.test2.test3.test4 = 'changed';
    });
    it('handles objects within arrays', (done) => {
        const D = ReduxDataManager({
            test1: [{
                test2: 'string'
            }]
        }, {
            test1: [{
                test2: 'initial'
            }]
        });
        D.subscribe(() => {
            try {
                expect(D.getState().test1).to.deep.equal([{
                    test2: 'changed'
                }]);
                expect(D.test1[0].test2).to.equal('changed');
                done();
            }
            catch (e) {
                done(e);
            }
        });
        expect(D.test1[0].test2).to.equal('initial');
        D.test1[0].test2 = 'changed';
    });
    it('duplicates every object in the chain', (done) => {
        const D = ReduxDataManager({
            test1: [{
                test2: 'string'
            }]
        }, {
            test1: [{
                test2: 'initial'
            }]
        });
        const initialState = D.getState();
        D.subscribe(() => {
            try {
                const newState = D.getState();
                expect(initialState.test1).to.equal(initialState.test1);
                expect(initialState.test1).to.not.equal(newState.test1);
                expect(initialState.test1[0]).to.not.equal(newState.test1[0]);
                expect(initialState.test1[0].test2).to.not.equal(newState.test1[0].test2);
                done();
            }
            catch (e) {
                done(e);
            }
        });
        D.test1[0].test2 = 'changed';
    });
    it('halts notifications', (done) => {
        const D = ReduxDataManager({
            test1: {
                test2: 'string'
            }
        }, {
            test1: {
                test2: 'initial'
            }
        });
        let halted = false;
        D.onAction((action) => {
            if (halted) {
                done(new Error("Should not call notifications while halted"))
            }
            else {
                try {
                    expect(action.type).to.equal("STATE_REPLACE");
                    done();
                }
                catch (e) {
                    done(e);
                }
            }
            return true;
        });
        D.haltNotifications(async () => {
            halted = true;
            D.test1.test2 = "test2";
            halted = false;
        });
    });
});