import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class TimerDisplay extends Component {
  static propTypes = {
    startedAt: PropTypes.object,
  }

  state = {
    elapsed: 0,
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => {
    // TODO: try this.props.startedAt.diff(moment())
    this.setState({ elapsed: moment().diff(this.props.startedAt) });
  }

  format(x) {
    return x < 10 ? `0${x}` : x;
  }

  render() {
    const duration = moment.duration(this.state.elapsed);
    const hours = this.format(duration.hours());
    const minutes = this.format(duration.minutes());
    const seconds = this.format(duration.seconds());

    return (
      <div className="TimerDisplay">
        <span className="hours">{hours}</span>
        <span className="minutes">:{minutes}</span>
        <span className="seconds">.{seconds}</span>
      </div>
    );
  }
}

export default TimerDisplay;
