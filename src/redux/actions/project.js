export const CREATE_PROJECT = "CREATE_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";
export const EDIT_PROJECT = "EDIT_PROJECT";

export const createProject = (id, project) => {
  return {
    type: CREATE_PROJECT,
    id,
    project,
  };
};

export const deleteProject = (id) => {
  return {
    type: DELETE_PROJECT,
    id,
  };
};

export const editProject = (id, project) => {
  return {
    type: EDIT_PROJECT,
    id,
    project,
  };
};

