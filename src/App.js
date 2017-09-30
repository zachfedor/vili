import React, { Component } from 'react';
import moment from 'moment';
import logo from './logo.svg';
import './App.css';


class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0 };
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick() {
    this.setState({ elapsed: moment().diff(this.props.startTime) });
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
      <div className="Timer">
        <span className="hours">{hours}</span>
        <span className="minutes">:{minutes}</span>
        <span className="seconds">.{seconds}</span>
      </div>
    );
  }
}

class App extends Component {
  state = {
    startTime: null,
    total: null,
  }

  startTimer() {
    this.setState({ startTime: moment() });
  }

  stopTimer() {
    const endTime = moment();
    this.setState({
      endTime,
      total: endTime.diff(this.state.startTime),
      startTime: null,
    })
  }

  render() {
    const lastTime = moment.duration(this.state.total);

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>

        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        {this.state.startTime !== null && (
          <Timer startTime={this.state.startTime} />
        )}

        {this.state.startTime !== null ? (
          <button onClick={() => { this.stopTimer(); }}>
            Stop
          </button>
        ) : (
          <button onClick={() => { this.startTimer(); }}>
            Start
          </button>
        )}

        {lastTime.isValid() && (
          <p>
            Last timer ran for {lastTime.hours()} hours, {lastTime.minutes()} minutes, and {lastTime.seconds()} seconds.
          </p>
        )}
      </div>
    );
  }
}

export default App;
