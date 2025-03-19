import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Express API is up!🚀');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);

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