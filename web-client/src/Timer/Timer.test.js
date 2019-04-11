import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import Timer from './Timer';

describe('Timer', () => {
  const defaultProps = {
    startedAt: null,
    pauseTimer: () => {},
    startTimer: () => {},
    stopTimer: () => {},
  };

  it('should render a start button in an inactive state', () => {
    const component = shallow(<Timer {...defaultProps} />);
    expect(component).toMatchSnapshot();
  });

  it('should render an active timer and a stop button', () => {
    const props = {
      ...defaultProps,
      startedAt: moment("20170101", "YYYYMMDD"),
    };
    const component = shallow(<Timer {...props} />);
    expect(component).toMatchSnapshot();
  });

  it('should dispatch the startTimer action', () => {
    const props = {
      ...defaultProps,
      startTimer: jest.fn(),
    };
    const component = shallow(<Timer {...props} />);
    expect(props.startTimer).not.toHaveBeenCalled();
    component.find('button').simulate('click');
    expect(props.startTimer).toHaveBeenCalled();
  });

  it('should dispatch the stopTimer action', () => {
    const props = {
      ...defaultProps,
      startedAt: moment(),
      stopTimer: jest.fn(),
    };
    const component = shallow(<Timer {...props} />);
    expect(props.stopTimer).not.toHaveBeenCalled();
    component.find('button').simulate('click');
    expect(props.stopTimer).toHaveBeenCalled();
  });
});

