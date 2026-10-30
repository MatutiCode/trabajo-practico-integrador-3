import eventModel from "../models/event.model.js";
import Event from "../models/event.model.js";

export const ownerOrAdminMiddleware = async (req, res, next) => {
  try {
    const event = await eventModel.findById(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ ok: false, message: "Evento no encontrado" });
    }

    const isOwner = event.organizer.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "Solo el organizador o un admin puede realizar esta acción",
      });
    }

    req.event = event;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};
