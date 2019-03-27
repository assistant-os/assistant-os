<h1 align="center">
  Assistant OS
</h1>
<div align="center">
<a href="https://lernajs.io/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="Maintained with lerna"/><a/>
<a href="https://cloud.drone.io/assistant-os/assistant-os">
  <img src="https://cloud.drone.io/api/badges/assistant-os/assistant-os/status.svg" alt="Build status" />
</a>
</div>

<br>

This project is a micro-services based chatbot to assist human beeing in repetitive and daily tasks. It also provides libraries to extends the capabilities.

## Getting started

First of all, be sure to have environment containing the proper
variables.

This project is maintained with lerna

```bash
$ npx lerna bootstrap
$ yarn start
```

Or you can use docker

```bash
$ docker build -t assistant-os/os
$ docker run --env-file .env -d assistant-os/os -p 8080:8080

```

## Roadmap

- see [here](https://github.com/orgs/assistant-os/projects/1).
