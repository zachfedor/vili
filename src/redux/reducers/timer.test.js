import timer, { initialState } from './timer';
import * as actions from '../actions/timer';

describe('Timer Reducer', () => {
  const timestamp = Date.now();
  const runningState = {
    start: timestamp,
    chunks: [],
  };
  const pausedState = {
    start: null,
    chunks: [{ start: timestamp, duration: Date.now() - timestamp }],
  };

  it('should return initial state', () => {
    const actual = timer(undefined, { type: 'UNKNOWN_ACTION' });
    const expected = {
      start: null,
      chunks: [],
    };

    expect(actual).toEqual(expected);
  });

  describe('On Start', () => {
    it('should should start a timer', () => {
      const actual = timer(initialState, actions.startTimer(timestamp));
      const expected = {
        start: timestamp,
        chunks: [],
      };

      expect(actual).toEqual(expected);
    });

    it('should do nothing if a timer is already running', () => {
      const actual = timer(runningState, actions.startTimer(timestamp));

      expect(actual).toEqual(runningState);
    });
  });

  describe('On Pause', () => {
    it('should should pause a running timer', () => {
      const actual = timer(runningState, actions.pauseTimer(timestamp + 10));
      const expected = {
        start: null,
        chunks: [{ start: timestamp, duration: 10 }],
      };

      expect(actual).toEqual(expected);
    });

    it('should do nothing if no timer is running', () => {
      const actual = timer(initialState, actions.pauseTimer(timestamp));

      expect(actual).toEqual(initialState);
    });
  });

  describe('On Stop', () => {
    it('should should stop a running timer', () => {
      const actual = timer(runningState, actions.stopTimer());

      expect(actual).toEqual(initialState);
    });

    it('should stop a paused timer', () => {
      const actual = timer(pausedState, actions.stopTimer());

      expect(actual).toEqual(initialState);
    });

    it('should do nothing if no timer is running', () => {
      const actual = timer(initialState, actions.stopTimer());

      expect(actual).toEqual(initialState);
    });
  });
});
