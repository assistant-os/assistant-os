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
