import { Response, NextFunction } from 'express';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { ISocket } from '../types/socket.interface';
import { Server } from 'socket.io';
import { SocketServerEvents } from '../types/socketServerEvents.enum';
import { getErrorMessage } from '../helpers';
import TaskModel from '../models/task';

export const getTasks = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }
        const tasks = await TaskModel.find({ boardId: req.params.boardId });
        res.send(tasks);
    } catch (error) {
        next(error);
    }
};

/**
 * To create a Task via socket io
 * @param io 
 * @param socket 
 * @param data 
 */
export const createTask = async (
    io: Server,
    socket: ISocket,
    data: { boardId: string; title: string; columnId: string }) => {
    try {
        if (!socket.user) {
            socket.emit(SocketServerEvents.tasksCreateFailure, 'Usuario no autorizado');
            return;
        }
        const newTask = new TaskModel({ 
            title: data.title,
            boardId: data.boardId,
            userId: socket.user.id
        });
        const savedTask = await newTask.save();
        console.log('Emitiendo task creada a columna:', savedTask);
        /* Se emite el evento tasksCreateSuccess a todos los clientes conectados 
            que estén suscritos a la sala con el ID data.boardId, 
            pasando la Task guardada recién creada como dato.*/
        io.to(data.boardId)
            .emit(SocketServerEvents.tasksCreateSuccess,
                savedTask);
    } catch (error) {
        socket.emit(SocketServerEvents.tasksCreateFailure, getErrorMessage(error));
    }
};