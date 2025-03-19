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

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        // deserializo el req   
      const { email, password } = req.body;
  
      // 1️⃣ Verificar que email y password sean proporcionados
      if (!email || !password) {
        res.status(400).json({ message: "Email y contraseña son requeridos." });
        return;
      }
  
      // 2️⃣ Buscar usuario por email (select +password para obtener el password dado que es privado)
      const usuario = await UserModel.findOne({ email }).select('+password');
      if (!usuario) {
        res.status(422).json({ message: "Credenciales incorrectas." });
        return;
      }
  
      // 3️⃣ Comparar contraseñas
      const isMatch = await usuario.validatePassword(password);
      if (!isMatch) {
        res.status(422).json({ message: "Credenciales incorrectas." });
        return;
      }
      res.send(normalizeUser(usuario));
    } catch (error) {
      next(error);
    }
  };
  

