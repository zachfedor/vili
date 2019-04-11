import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TimerDisplay from './TimerDisplay';


const Timer = (props) => {
  function handleStart() {
    props.startTimer(moment());
  }

  function handleStop() {
    props.stopTimer(moment());
  }

  return (
    <div className="Timer">
      {props.startedAt !== null && (
        <TimerDisplay startedAt={props.startedAt} />
      )}

      {props.startedAt !== null ? (
        <button onClick={handleStop}>
          Stop
        </button>
      ) : (
        <button onClick={handleStart}>
          Start
        </button>
      )}
    </div>
  );
};

Timer.propTypes = {
  startedAt: PropTypes.object,
  pauseTimer: PropTypes.func.isRequired,
  startTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
};

export default Timer;

