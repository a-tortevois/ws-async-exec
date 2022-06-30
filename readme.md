## WebSocket with async child process exec

This is an example of how to run a command line from a web socket service and send the result asynchronously to clients

Disclaimer: Be careful, this is an unsafe example, never do this in production !!!

Documentation: https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback

1. Run `node index.js` and the attached flow with `node-red`

2. Expected output: 
```
6/30/2022, 11:43:50 AM WebSocketServer: New connexion from ::ffff:127.0.0.1:59591
6/30/2022, 11:43:55 AM WebSocket received message: {"_msgid":"c9a9c1fdb5a53e94","payload":39}
6/30/2022, 11:44:00 AM WebSocket received message: {"_msgid":"7b9bac57b23f5dca","payload":6}
6/30/2022, 11:44:05 AM WebSocket received message: {"_msgid":"a079fd3f1c219431","payload":38}
6/30/2022, 11:44:06 AM true, {"_msgid":"7b9bac57b23f5dca","output":{"stdout":"\"Hello word\"\r\n","stderr":""},"status":200,"timestamp":"1656582246"}
6/30/2022, 11:44:10 AM WebSocket received message: {"_msgid":"6eee5cb268d97a95","payload":34}
6/30/2022, 11:44:25 AM false, {"_msgid":"c9a9c1fdb5a53e94","output":{},"status":400,"error":"Command failed: sleep 39 | echo \"Hello word\"\n","timestamp":"1656582265"}
6/30/2022, 11:44:35 AM false, {"_msgid":"a079fd3f1c219431","output":{},"status":400,"error":"Command failed: sleep 38 | echo \"Hello word\"\n","timestamp":"1656582275"}
6/30/2022, 11:44:40 AM false, {"_msgid":"6eee5cb268d97a95","output":{},"status":400,"error":"Command failed: sleep 34 | echo \"Hello word\"\n","timestamp":"1656582280"}
```
