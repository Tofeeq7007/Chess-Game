import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT ;
const wss = new WebSocketServer({ port: PORT });

const gameManager = new GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on('close' , ()=>{
        gameManager.removeUser(ws); 
    })
});  