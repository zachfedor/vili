import { combineReducers } from 'redux';
import projects from './projects';
import timer from './timer';

const rootReducer = combineReducers({
  timer,
  projects,
});

export default rootReducer;

