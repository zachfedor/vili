import * as actions from './project';

describe('Project Actions', () => {
  const mockProject = {
    name: 'Foo',
    createdAt: Date.now(),
  };

  describe('createProject', () => {
    it('should return the correct action', () => {
      const actual = actions.createProject(1, mockProject);
      const expected = {
        type: actions.CREATE_PROJECT,
        id: 1,
        project: mockProject,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('deleteProject', () => {
    it('should return the correct action', () => {
      const actual = actions.deleteProject(1);
      const expected = {
        type: actions.DELETE_PROJECT,
        id: 1,
      };

      expect(actual).toEqual(expected);
    });
  });

  describe('editProject', () => {
    it('should return the correct action', () => {
      const actual = actions.editProject(1, mockProject);
      const expected = {
        type: actions.EDIT_PROJECT,
        id: 1,
        project: mockProject,
      };

      expect(actual).toEqual(expected);
    });
  });
});
