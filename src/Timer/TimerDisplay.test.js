import React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import TimerDisplay from './TimerDisplay';

describe('TimerDisplay', () => {
  it('should render elapsed time', () => {
    const startedAt = moment("20170101", "YYYYMMDD");
    const component = shallow(<TimerDisplay startedAt={startedAt} />);
    expect(component).toMatchSnapshot();
  });
});
