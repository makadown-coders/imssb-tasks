import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import * as usersController from './controllers/users';
import * as boardsController from './controllers/boards';
import bodyParser from 'body-parser';
import authMiddleware from './middlewares/auth';
import cors from 'cors';
import { SocketServerEvents } from './types/socketServerEvents.enum';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('toJSON', {
    virtuals: true, /* incluye campos virtuales (campos que no se
     almacenan en la base de datos sino que se calculan sobre la marcha)
      al convertir un documento Mongoose a JSON. */
    transform: (_, converted) => {
        delete converted._id;
    }, /* La función de transformación cambia el campo [_id] por [id] en la salida JSON.
     Esto puede hacerse por razones de nomenclatura, consistencia, compatibilidad o estandar,
      ya que el campo _id es un identificador específico de MongoDB que podría no ser
       fácil de entender para usuarios humanos. */
});

app.get('/', (req, res) => {
    res.send('Express API is up!🚀');
});

app.post('/api/users', usersController.register);
app.post('/api/users/login', usersController.login);
app.get('/api/user', authMiddleware, usersController.currentUser);
app.get('/api/boards', authMiddleware, boardsController.getBoards);
app.post('/api/boards', authMiddleware, boardsController.createBoard);
app.get('/api/boards/:boardId', authMiddleware, boardsController.getBoard);

io.on('connection', (socket) => {
    socket.on(SocketServerEvents.boardsJoin, (data) => {
        boardsController.joinBoard(io, socket, data);
    });
    socket.on(SocketServerEvents.boardsLeave, (data) => {
        boardsController.leaveBoard(io, socket, data);
    });
});

mongoose.connect('mongodb://localhost:27017/imssb-tasks').then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(4001, () => {
        console.log('API is listening on port 4001!🚀');
    });
}).catch((err) => {
    console.log(err);
});