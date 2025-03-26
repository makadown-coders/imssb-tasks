import { Request, Response, NextFunction } from 'express';
import { Server, Socket } from 'socket.io';
import BoardModel from '../models/board';
import { ExpressRequestInterface } from '../types/expressRequest.interface';

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
    socket: Socket,
    data: { boardId: string }
) => {
    console.log('socket de servidor incorporándose al board', data.boardId);
    socket.join(data.boardId);
};

export const leaveBoard = (
    io: Server,
    socket: Socket,
    data: { boardId: string }
) => {
    console.log('socket de servidor abandonando el board', data.boardId);
    socket.leave(data.boardId);
};