export const uri = 'timelog'

export const getProjects = state =>
  Object.keys(state[uri].projects.byId).map(id => {
    const project = state[uri].projects.byId[id]
    return {
      id,
      name: project.name,
      ...project.list[project.list.length - 1],
    }
  })
