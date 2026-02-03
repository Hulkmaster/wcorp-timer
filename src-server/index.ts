import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import cors from 'cors';

const PORT = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
  }
});

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeid(length: number) {
    let result           = '';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const roomMap = new Map();

app.use(cors())

app.post('/rooms', (req, res) => {
  const ID = makeid(20);
  roomMap.set(ID, {});
  res.send(ID);
});

app.post('/rooms', (req, res) => {
  const ID = makeid(20);
  roomMap.set(ID, {});
  res.send(ID);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(PORT, () => {
  console.log('server running at http://localhost:3000');
});
