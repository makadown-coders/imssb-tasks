import {Request, Response, NextFunction} from 'express';
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
        const boards = await BoardModel.find({userId: req.user!.id});
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