import { verifyToken } from "../helpers/jwt.js";
import UserModel from "moongose/models/user_model.js";

export const authMiddleware = async (req, resizeBy, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ ok: false, message: 'No autenticado'});
        }

        const decoded = verifyToken(token);

        const user = await UserModel.findOne({ _id: decoded.id, deletedAt: null })

        if (!user) {
            return res.status(401).json({ ok: false, message: 'Usuario no válido'});
        }

        req.user = user;
        next();
    }   catch (error) {
        return res.status(401).json({ ok: false, message: 'token inválido o expirado'});
    }
};