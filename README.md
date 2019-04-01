<h1 align="center">
  Assistant OS
</h1>
<div align="center">
<a href="https://lernajs.io/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="Maintained with lerna"/><a/>
<a href="https://cloud.drone.io/assistant-os/assistant-os">
  <img src="https://cloud.drone.io/api/badges/assistant-os/assistant-os/status.svg" alt="Build status" />
</a>
<a href="./LICENSE">
  <img src="https://img.shields.io/github/license/assistant-os/assistant-os.svg" alt="MIT License" />
</a>
</div>

<br>

This project is a micro-services based chatbot to assist human beeing in repetitive and daily tasks. It also provides libraries to extends the capabilities.

## Getting started

First of all, be sure to have environment containing the proper
variables.

Create a .env file containing credentials. Cf [./doc/env.md](./doc/env.md).

Then

```bash
$ npx lerna bootstrap
$ yarn start
```

> This project is maintained with lerna.

Or you can use docker

```bash
$ docker-compose -f docker-compose.yml build
$ docker-compose -f docker-compose.yml up -d

```

## Roadmap

- see [here](https://github.com/orgs/assistant-os/projects/1).

## Linkds

- [Adapters](./doc/adapters.md)
