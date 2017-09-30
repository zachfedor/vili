export const TIMER_START  = "TIMER_START";
export const TIMER_PAUSE  = "TIMER_PAUSE";
export const TIMER_RESUME = "TIMER_RESUME";
export const TIMER_STOP   = "TIMER_STOP";
export const TIMER_CANCEL = "TIMER_CANCEL";

export const startTimer = () => {
  return {
    type: TIMER_START,
  };
};
export const pauseTimer = () => {
  return {
    type: TIMER_PAUSE,
  };
};
export const resumeTimer = () => {
  return {
    type: TIMER_RESUME,
  };
};
export const stopTimer = () => {
  return {
    type: TIMER_STOP,
  };
};
export const cancelTimer = () => {
  return {
    type: TIMER_CANCEL,
  };
};
