import { Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import { ISocket } from '../types/socket.interface';
import BoardModel from '../models/board';
import { ExpressRequestInterface } from '../types/expressRequest.interface';
import { SocketServerEvents } from '../types/socketServerEvents.enum';
import { getErrorMessage } from '../helpers';

export const getBoards = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }
        const boards = await BoardModel.find({ userId: req.user!.id });
        res.send(boards);
    } catch (error) {
        next(error);
    }
};

export const createBoard = async (
    req: ExpressRequestInterface,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.user) {
            res.sendStatus(401);
            return;
        }
        const newBoard = new BoardModel({
            title: req.body.title,
            userId: req.user!.id
        });
        const savedBoard = await newBoard.save();
        res.send(savedBoard);
    } catch (error) {
        next(error);
    }
};

export const getBoard = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        if (!req.params.boardId) {
            res.sendStatus(401);
            return;
        }
        const board = await BoardModel.findById(req.params.boardId);
        if (!board) {
            res.sendStatus(404);
            return;
        }
        res.send(board);
    } catch (error) {
        next(error);
    }
};

export const joinBoard = (
    io: Server,
    socket: ISocket,
    data: { boardId: string }
) => {
    console.log(`${socket.user} incorporándose al board ${data.boardId}`,);
    socket.join(data.boardId);
};

export const leaveBoard = (
    io: Server,
    socket: ISocket,
    data: { boardId: string }
) => {
    console.log(`${socket.user} abandonó el board ${data.boardId}`,);
    socket.leave(data.boardId);
};

export const updateBoard = async (
    io: Server,
    socket: ISocket,
    data: { boardId: string, fields: { title: string } }
) => {
    try {
        console.log('data recibida', data);
        // revisar primero si hay usuario valido
        if (!socket.user) {
            socket.emit(SocketServerEvents.boardsUpdateFailure,
                'Usuario no autorizado');
            return;
        }
        const updatedBoard = await BoardModel
            .findOneAndUpdate({ _id: data.boardId }, data.fields, { new: true });
        /* const updatedBoard = await BoardModel.findByIdAndUpdate( 
              data.boardId, data.fields, { new: true }); */
        console.log('Emitiendo board actualizado al board:', updatedBoard);
        /* Se emite el evento boardsUpdateSuccess a todos los clientes conectados 
            que estén suscritos a la sala con el ID data.boardId, 
            pasando el board guardado recién actualizado como dato.*/
        io.to(data.boardId)
            .emit(SocketServerEvents.boardsUpdateSuccess,
                updatedBoard);
    } catch (error) {
        socket.emit(SocketServerEvents.boardsUpdateFailure, getErrorMessage(error));
    }
};
