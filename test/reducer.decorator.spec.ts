import 'es6-shim';
import {sinon} from './sinon';
import {expect} from './must';
import {Reducer, DefaultReducer, addReducer, getActionReducers} from '../src/reducer.decorator';
import {getStore} from '../src/store.decorator';

describe('@Reducer', function() {

    describe('DefaultReducer', function() {

        it('must pass data through to reducer methods', function() {
            let actionReducer = { add: () => {} };
            let defaultReducer = new DefaultReducer();
            let spy = sinon.spy(actionReducer, 'add');
            let state = {}, values = [1, 'test'], type = 'add';
            addReducer(type, actionReducer.add);
            defaultReducer.reducer(state, {type: type, data: values});
            expect(spy.calledWithExactly(state, values[0], values[1])).to.be.true();
        })

    });

    describe('root reducer', function() {

        it('must pass state and action when calling reducer method', function() {

            @Reducer()
            class RootReducer { reducer(state, action) {} }
            let spy = sinon.spy(RootReducer.prototype, 'reducer');
            getStore().then(function(store) {
                store.dispatch('action', 1, 2, 3);
                expect(spy.calledWithExactly('action', [1, 2, 3]))
            });

        });

    });

    describe('action reducers', function() {

        it('must allow multiple action reducers to be registered with @Reducer', function() {

            @Reducer('one', 'two', 'three')
            class ActionReducers { one() {} two() {} three() {} }
            let [one, two, three] = getActionReducers().splice(-3);

            expect(one).property('type', 'one');
            expect(one).property('method', ActionReducers.prototype.one);

            expect(two).property('type', 'two');
            expect(two).property('method', ActionReducers.prototype.two);

            expect(three).property('type', 'three');
            expect(three).property('method', ActionReducers.prototype.three);

        });

    })

});
