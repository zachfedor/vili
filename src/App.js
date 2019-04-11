import React from 'react';
import moment from 'moment';
import logo from './logo.svg';
import TimerContainer from './Timer/TimerContainer';
import './App.css';


class App extends React.Component {
  state = {
    startTime: null,
    total: null,
  }

  startTimer = () => {
    this.setState({ startTime: moment() });
  }

  stopTimer = () => {
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

        <TimerContainer />

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
