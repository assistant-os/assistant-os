# node api

```
node -> nexus
event name: data
{
  token: <token>
  type: <string>
  payload: {

  }
}
```

```
node -> nexus
event name: data
{
  token: <token>
  type: 'register'
  payload: {
    label: <string>,
    priority: <string>,
    type: adapter|module,
  }
}
```

```
node -> nexus
event name: data
{
  token: <token>
  type: 'message'
  payload: {
    format: 'text',
    content: ''
  }
}
```

```
node -> nexus
event name: hello
{
  token: <token>
}
```

```
nexus -> node
event name: set-behavior
[
  {
    type: <type>
    device: {
      ip: <ip>
    }

  }
]
```

```
node -> nexus
event name: behavior-result
{
  token: <token>,
  type: <event type>,
  payload: {
    device: device.device,
    currentState: device.isPresent,
    previousState: previous
  }

}

```
