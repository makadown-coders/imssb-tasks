import { Socket } from "socket.io";
import { UserDocument } from "./user.interface";

export interface ISocket extends Socket {
    user?: UserDocument;
}
