import * as actions from './timer';

describe('Timer Actions', () => {
  describe('startTimer', () => {
    it('should return the correct action', () => {
      const actual = actions.startTimer();
      const expected = {
        type: actions.TIMER_START,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('pauseTimer', () => {
    it('should return the correct action', () => {
      const actual = actions.pauseTimer();
      const expected = {
        type: actions.TIMER_PAUSE,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('resumeTimer', () => {
    it('should return the correct action', () => {
      const actual = actions.resumeTimer();
      const expected = {
        type: actions.TIMER_RESUME,
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

  describe('cancelTimer', () => {
    it('should return the correct action', () => {
      const actual = actions.cancelTimer();
      const expected = {
        type: actions.TIMER_CANCEL,
      };

      expect(actual).toEqual(expected);
    });
  });
});
