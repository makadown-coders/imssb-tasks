import { Schema, model } from 'mongoose';
import { UserDocument } from '../types/user.interface';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

const userSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: [true, 'Email es requerido'],
        validate: [validator.isEmail, 'Email no es válido'],
        createIndexes: { unique: true } // esto solo sera creado despues de reiniciar la BD 
    },
    username: {
        type: String,
        required: [true, 'Username es requerido']
    },
    password: {
        type: String,
        required: [true, 'Password es requerido'],
        select: false // nunca se eligirá esta propiedad en petición de datos.
    }
},
    { 
        timestamps: true
    }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(this.password, salt);
        this.password = hash;
        return next();
    } catch (error) {
        return next(error as Error);
    }
});

userSchema.methods.validatePassword = function(password: string) {
    return bcryptjs.compare(password, this.password);
}

export default model<UserDocument>('User', userSchema);
