import { omit } from 'lodash';
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  EDIT_PROJECT,
} from '../actions/project';
import { TIMER_STOP } from '../actions/timer';

export const initialState = {};

const projects = (state = initialState, action) => {
  switch (action.type) {

    case CREATE_PROJECT:
      return {
        ...state,
        [action.id]: action.project,
      };

    case DELETE_PROJECT:
      return omit(state, action.id);

    case EDIT_PROJECT:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.project,
        },
      };

    case TIMER_STOP:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          times: [
            ...state[action.id].times,
            { elapsed: action.elapsed },
          ],
        },
      };

    // case ADD_TIME:
    // case EDIT_TIME:
    // case DELETE_TIME:

    default:
      return state;
  }
};

export default projects;
