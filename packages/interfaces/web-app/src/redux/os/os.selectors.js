export const uri = 'os'

export const getMemory = (state, id) => state[uri].memory[id]

export const getStage = state => state[uri].stage
