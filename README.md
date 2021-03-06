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

This project is a virtual assistant to assist users in repetitive and daily tasks.

## Getting started

Create a _.env_ file containing credentials. An example is provided in [.env.example](.env.example). You can also set the variables globally depending on your OS.

Then

```bash
$ yarn
$ yarn start
```

> This project is maintained with lerna.

Or you can use docker

```bash
$ docker-compose build
$ docker-compose up -d
```

<!--
It will start a chatbot that can be remotely controlled from [assistant-os.github.io](https://assistant-os.github.io).
-->

## Contribute

Please read [development guidelines](./CONTRIBUTING.md) before proposing a pull request.

## Roadmap

These are the next features to come:

- [timelog]: help the user to log his spend time and store on google drive
- [identity]: auto configuration of the virtual assistant
- [web app]: refactor to make action more automatic
- [movies, tv shows]: notify the user for a release
- [memory]: save information
- [urls]: save url and propose automatic behaviors like auto watch
- [contracts]: generate invoice automatically in google drive

<!--

## Links

- [Adapters](./doc/adapters.md)
- [Kinds of chatbots](https://medium.com/the-chatbot-guru/the-3-types-of-chatbots-acc5cdf6bb4e)

-->
