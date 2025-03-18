import jwt from 'jsonwebtoken';
import { secret } from '../config';
import { UserDocument } from '../types/user.interface';

export const normalizeUser = (user: UserDocument) => {
    const token = jwt.sign({ id: user.id, email: user.email }, secret);
    return {
        email: user.email,
        username: user.username,
        id: user.id,
        token
    };
};
