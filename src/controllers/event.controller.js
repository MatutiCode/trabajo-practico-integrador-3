import { matchedData } from "express-validator";
import Event from "../models/event.model.js";

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      capacity,
      price,
      status,
      location,
      categories,
    } = matchedData(req);

    const exists = await Event.findOne({ title });
    if (exists) {
      return res
        .status(400)
        .json({ ok: false, message: "Ya existe un evento con ese título" });
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      capacity,
      price,
      status,
      location,
      categories,
      organizer: req.user._id,
    });

    await event.populate([
      { path: "organizer", select: "username email" },
      { path: "categories" },
    ]);

    return res.status(201).json({
      ok: true,
      message: "Evento creado correctamente",
      event,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "username email")
      .populate("categories");

    return res.status(200).json({ ok: true, events });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).populate(
      "categories",
    );

    return res.status(200).json({ ok: true, events });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const event = await Event.findById(id)
      .populate("organizer", "username email")
      .populate("categories");

    if (!event) {
      return res
        .status(404)
        .json({ ok: false, message: "Evento no encontrado" });
    }

    return res.status(200).json({ ok: true, event });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id, ...fields } = matchedData(req);

    if (fields.title) {
      const titleTaken = await Event.findOne({
        title: fields.title,
        _id: { $ne: id },
      });
      if (titleTaken) {
        return res
          .status(400)
          .json({ ok: false, message: "Ya existe un evento con ese título" });
      }
    }

    const event = req.event;
    Object.assign(event, fields);
    await event.save();

    await event.populate([
      { path: "organizer", select: "username email" },
      { path: "categories" },
    ]);

    return res.status(200).json({
      ok: true,
      message: "Evento actualizado correctamente",
      event,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await req.event.deleteOne();

    return res.status(200).json({
      ok: true,
      message: "Evento eliminado correctamente",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};
