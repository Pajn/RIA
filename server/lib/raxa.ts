import 'babel-polyfill';
import * as http from 'http';
import express from 'express';
import requireDir from 'require-dir';
import {createWebSocketServer} from './websocket';

const app = express();
const server = http.createServer(app);

app.get('/', function(req, res) {
    res.render('index', { layout: false });
});
server.listen(8080);

createWebSocketServer(server);

requireDir('./remote-procedures/');
