import projects, { initialState } from './projects';
import * as actions from '../actions/project';

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
});
