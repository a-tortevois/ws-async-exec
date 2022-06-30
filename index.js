const WebSocket = require('ws');
const util = require('node:util');
const child_process_exec = util.promisify(require('node:child_process').exec);

const log = (msg) => {
    console.log(`${new Date().toLocaleString()} ${msg}`);
}

const wss = new WebSocket.Server({port: 8000});
wss.on('close', () => {
    log('WebSocketServer: Close');
});

// WebSocket.Server Event: 'connection'
wss.on('connection', (ws, req) => {
    ws.ip = req.connection.remoteAddress + ':' + req.connection.remotePort;
    ws.isAlive = true;

    log(`WebSocketServer: New connexion from ${ws.ip}`);

    //  WebSocket Event: 'close'
    ws.on('close', () => {
        log(`WebSocket: Close ${ws.ip}`);
    });

    //  WebSocket Event: 'error'
    ws.on('error', (error) => {
        log(`WebSocket: Error on ${ws.ip}: ${error}`);
    });

    //  WebSocket Event: 'message'
    ws.on('message', (data) => {
        log(`WebSocket received message: ${data}`);
        let msg;
        try {
            msg = JSON.parse(data);
            const cmd = `sleep ${msg.payload} | echo "Hello word"`; // /!\ Unsafe, never do this in production !!! 
            const result = {
                _msgid: msg._msgid
            };
            exec(cmd, result, {timeout: 30}).then((res) => {
                result.timestamp = (Date.now() / 1_000).toFixed(0);
                log(`${res}, ${JSON.stringify(result)}`);
                sendToAllClients(result);
            });
        } catch (e) {
            log(`WebSocket: ${e.message} | data: ${data}`);
            return;
        }
    });

    // WebSocket Event: 'open'
    // WebSocket Event: 'ping'
    // WebSocket Event: 'pong'
    // WebSocket Event: 'unexpected-response'
    // WebSocket Event: 'upgrade'
});

// WebSocket.Server Event: 'error'
wss.on('error', (error) => {
    log(`WebSocketServer Error: ${error}`);
});

const sendToAllClients = (msg) => {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(msg));
        }
    });
}

const exec = async (cmd, msg, options = {}) => {
    // log(`exec ${cmd}`);
    msg.output = {};
    try {
        if (options.timeout) {
            msg.output = await child_process_exec(cmd, {timeout: options.timeout * 1_000});
        } else {
            msg.output = await child_process_exec(cmd);
        }
    } catch (e) {
        // log(`exec error: ${e.message}`);
        if (msg) {
            msg.status = 400;
            msg.error = e.message;
        }
        return false;
    }
    msg.status = 200;
    return true;
}