import projects, { initialState } from './projects';
import * as actions from '../actions/project';
import { stopTimer } from '../actions/timer';

describe('Projects Reducer', () => {
  const mockProjects = {
    1: {
      name: 'Foo',
      createdAt: Date.now(),
      times: [],
    },
    2: {
      name: 'Bar',
      createdAt: Date.now(),
      times: [],
    },
  };

  describe('On Create', () => {
    it('should create a new project', () => {
      const action = actions.createProject(1, mockProjects[1]);
      const actual = projects(initialState, action);
      const expected = { 1: mockProjects[1] };

      expect(actual).toEqual(expected);
    });
  });

  describe('On Delete', () => {
    it('should delete an existing project', () => {
      const action = actions.deleteProject(1);
      const actual = projects(mockProjects, action);
      const expected = { 2: mockProjects[2] };

      expect(actual).toEqual(expected);
    });
  });

  describe('On Edit', () => {
    it('should update an existing project', () => {
      const action = actions.editProject(1, mockProjects[2]);
      const actual = projects(mockProjects, action);
      const expected = {
        1: mockProjects[2],
        2: mockProjects[2],
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('On Timer Stop', () => {
    it('should add elapsed time to an existing project', () => {
      const action = stopTimer(1, 10);
      const actual = projects(mockProjects, action);
      const expected = {
        1: {
          ...mockProjects[1],
          times: [{ elapsed: 10 }],
        },
        2: mockProjects[2],
      };

      expect(actual).toEqual(expected);
    });
  });
});
