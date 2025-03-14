import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/', (req, res) => {
    res.send('Express API is up!🚀');
});

io.on('connection', (socket) => {
    console.log('Socket connected');
});

mongoose.connect('mongodb://localhost:27017/imssb-tasks').then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(4001, () => {
        console.log('API is listening on port 4001!🚀');
    });
}).catch((err) => {
    console.log(err);
});