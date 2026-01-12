import jwt from 'jsonwebtoken';

export const socketAuth = (socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token){
        return next (new Error("Unauthorized"));
    }

    try{
        socket.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return next(new Error("Unauthorized"));
    }
}