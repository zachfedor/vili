import * as actions from './timer';

describe('Timer Actions', () => {
  describe('startTimer', () => {
    it('should return the correct action', () => {
      const now = Date.now();
      const actual = actions.startTimer(now);
      const expected = {
        type: actions.TIMER_START,
        startAt: now,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('pauseTimer', () => {
    it('should return the correct action', () => {
      const now = Date.now();
      const actual = actions.pauseTimer(now);
      const expected = {
        type: actions.TIMER_PAUSE,
        pauseAt: now,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('stopTimer', () => {
    it('should return the correct action', () => {
      const actual = actions.stopTimer();
      const expected = {
        type: actions.TIMER_STOP,
      };

      expect(actual).toEqual(expected);
    });
  });
});
