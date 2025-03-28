import { Response, NextFunction } from 'express';
import ColumnModel from '../models/column';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { ISocket } from '../types/socket.interface';
import { Server } from 'socket.io';
import { SocketServerEvents } from '../types/socketServerEvents.enum';
import { getErrorMessage } from '../helpers';

export const getColumns = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }
        const columns = await ColumnModel.find({ boardId: req.params.boardId });
        res.send(columns);
    } catch (error) {
        next(error);
    }
};

/**
 * To create a column via socket io
 * @param io 
 * @param socket 
 * @param data 
 */
export const createColumn = async (
    io: Server,
    socket: ISocket,
    data: { boardId: string; title: string }) => {
    try {
        if (!socket.user) {
            socket.emit(SocketServerEvents.columnsCreateFailure, 'Usuario no autorizado');
            return;
        }
        const newColumn = new ColumnModel({ 
            title: data.title,
            boardId: data.boardId,
            userId: socket.user.id
        });
        const savedColumn = await newColumn.save();
        console.log('Emitiendo columna creada al board:', savedColumn);
        /* Se emite el evento columnasCreateSuccess a todos los clientes conectados 
            que estén suscritos a la sala con el ID data.boardId, 
            pasando la columna guardada recién creada como dato.*/
        io.to(data.boardId)
            .emit(SocketServerEvents.columnsCreateSuccess,
                savedColumn);
    } catch (error) {
        socket.emit(SocketServerEvents.columnsCreateFailure, getErrorMessage(error));
    }
};