import { connect } from 'react-redux';
import Timer from './Timer';
import {
  pauseTimer,
  startTimer,
  stopTimer,
} from '../redux/actions/timer';

export const mapStateToProps = (state) => {
  return {
    startedAt: state.timer.startedAt,
  };
};

const actionCreators = {
  pauseTimer,
  startTimer,
  stopTimer,
};

export default connect(
  mapStateToProps,
  actionCreators,
)(Timer);

