import {
  TIMER_START,
  TIMER_PAUSE,
  TIMER_STOP,
} from '../actions/timer';

export const initialState = {
  start: null,
  chunks: [],
};

const timer = (state = initialState, action) => {
  switch (action.type) {

    case TIMER_START:
      // Don't start the timer if it's already running
      if (state.start !== null) return state;

      return {
        ...state,
        start: action.startAt,
      };

    case TIMER_PAUSE:
      // Don't pause the timer if it isn't running
      if (state.start === null) return state;

      return {
        start: null,
        chunks: [
          ...state.chunks,
          { start: state.start, duration: action.pauseAt - state.start },
        ],
      };

    case TIMER_STOP:
      return initialState;

    default:
      return state;
  }
};

export default timer;
