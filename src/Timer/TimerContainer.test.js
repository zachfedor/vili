import React from 'react';
import { mount } from 'enzyme';
import moment from 'moment';
import TimerContainer, { mapStateToProps } from './TimerContainer';

const createMockStore = (state) => ({
  getState: () => state,
  dispatch: () => {},
  subscribe: () => {},
});

describe('TimerContainer', () => {
  const startedAt = moment();
  const store = createMockStore({
    timer: {
      startedAt,
    },
  });

  it('should not fail to render', () => {
    const render = () => {
      mount(<TimerContainer store={store}/>);
    };
    expect(render).not.toThrow();
  });

  describe('mapStateToProps', () => {
    it('should return initial state', () => {
      const actual = mapStateToProps(store.getState());
      const expected = { startedAt };

      expect(actual).toEqual(expected);
    });
  });
});
