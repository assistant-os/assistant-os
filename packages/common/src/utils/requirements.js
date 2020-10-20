export class EnvError extends Error {
  constructor(envs) {
    super('error')
    this.envs = envs

    this.message = `Environment configuration error: ${envs
      .map(env => `${env}=${process.env[env]}`)
      .join(',')}`
  }
}

export const requireEnv = envs => {
  envs.forEach(env => {
    if (!process.env[env]) {
      throw new EnvError([env])
    }
  })
}
