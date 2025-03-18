import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import moongoose from 'mongoose';
import { normalizeUser } from '../utils/normalizeUser';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const newUser = new UserModel({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        });
        const savedUser = await newUser.save();
        res.send(normalizeUser(savedUser));
    } catch (error) {
        if (error instanceof moongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map(err => err.message);
            res.status(422).json(messages);
            return;
        }
        next(error);
    }
};

