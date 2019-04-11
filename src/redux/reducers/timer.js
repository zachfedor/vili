import {
  TIMER_START,
  TIMER_PAUSE,
  TIMER_STOP,
} from '../actions/timer';

export const initialState = {
  startedAt: null,
  chunks: [],
};

const timer = (state = initialState, action) => {
  switch (action.type) {

    case TIMER_START:
      // Don't start the timer if it's already running
      if (state.startedAt !== null) return state;

      return {
        ...state,
        startedAt: action.startAt,
      };

    case TIMER_PAUSE:
      // Don't pause the timer if it isn't running
      if (state.startedAt === null) return state;

      return {
        startedAt: null,
        chunks: [
          ...state.chunks,
          { startedAt: state.startedAt, duration: action.pauseAt - state.startedAt },
        ],
      };

    case TIMER_STOP:
      return initialState;

    default:
      return state;
  }
};

export default timer;
