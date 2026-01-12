import jwt from "jsonwebtoken";

const authMiddleware = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({message: "No token provided"});
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: "No token provided"});
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "supersecret"
        );
        req.user = decoded;
        next();
    } catch (error){
        return res.status(401).json({message: "Invalid token"});
    }
};

export default authMiddleware;

export const authenticate = (req, res, next) =>{
    if(req.user.role !== "owner"){
        return res.status(403).json({ message: "unauthorized"});
    }
    next();
};

export const isOwner = (req, res, next) => {
    if(req.user.role !== "owner"){
        return res.status(403).json({message: "Forbidden"});
    }
    next();
};
 