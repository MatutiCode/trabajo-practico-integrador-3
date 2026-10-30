
import { verifyToken } from "../helpers/jwt.js";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: 'No autenticado'
            });
        }

        const decoded = verifyToken(token);

        const user = await User.findOne({
            _id: decoded.id,
            deletedAt: null
        });

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Usuario no válido'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Token inválido o expirado'
        });
    }
};
