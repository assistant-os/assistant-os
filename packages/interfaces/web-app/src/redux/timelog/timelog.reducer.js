import { generateRandom } from 'utils/random'
import { START_PROJECT, STOP_PROJECT } from './timelog.actions'

export const initState = {
  projects: {
    byId: {},
  },
}

export default (state = initState, action) => {
  switch (action.type) {
    case START_PROJECT: {
      const id = state.projects.byId[action.payload.id]
        ? action.payload.id
        : generateRandom()
      const defaultList = state.projects.byId[action.payload.id]
        ? state.projects.byId[action.payload.id].list
        : []
      return {
        ...state,
        projects: {
          ...state.projects,
          byId: {
            ...state.projects.byId,
            [id]: {
              name: action.payload.name,
              list: [
                ...defaultList,
                {
                  startedAt: action.payload.startedAt,
                  stoppedAt: null,
                },
              ],
            },
          },
        },
      }
    }

    case STOP_PROJECT: {
      const { id } = action.payload
      const { list } = state.projects.byId[id]

      list[list.length - 1].stoppedAt = action.payload.stoppedAt
      return {
        ...state,
        projects: {
          ...state.projects,
          byId: {
            ...state.projects.byId,
            [id]: {
              ...state.projects.byId[id],
              list,
            },
          },
        },
      }
    }
    default:
      return state
  }
}
