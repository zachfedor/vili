export const TIMER_START  = "TIMER_START";
export const TIMER_PAUSE  = "TIMER_PAUSE";
export const TIMER_STOP   = "TIMER_STOP";

export const startTimer = (startAt) => {
  return {
    type: TIMER_START,
    startAt,
  };
};

export const pauseTimer = (pauseAt) => {
  return {
    type: TIMER_PAUSE,
    pauseAt,
  };
};

export const stopTimer = () => {
  return {
    type: TIMER_STOP,
  };
};

