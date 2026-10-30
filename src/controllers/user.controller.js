import { matchedData } from 'express-validator';
import User from '../models/user.model.js';
import Event from '../models/event.model.js';

export const getUsers = async (req, res) => {
  try {
    // Solo usuarios activos
    const users = await User.find({ deletedAt: null }).populate('events');

    return res.status(200).json({ ok: true, users });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = matchedData(req);

    const user = await User.findOne({ _id: id, deletedAt: null }).populate('events');
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ ok: true, user });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, profile, ...fields } = matchedData(req);

    // Verificación de existencia
    const user = await User.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    // Verificación de unicidad (ignorando al propio usuario)
    if (fields.username || fields.email) {
      const conditions = [];
      if (fields.username) conditions.push({ username: fields.username });
      if (fields.email) conditions.push({ email: fields.email });

      const taken = await User.findOne({ $or: conditions, _id: { $ne: id } });
      if (taken) {
        return res.status(400).json({
          ok: false,
          message: 'El username o el email ya están en uso',
        });
      }
    }

    Object.assign(user, fields);
    if (profile) Object.assign(user.profile, profile);
    await user.save();

    return res.status(200).json({
      ok: true,
      message: 'Usuario actualizado correctamente',
      user,
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Un admin no puede eliminarse a sí mismo
    if (req.user._id.equals(id)) {
      return res.status(400).json({
        ok: false,
        message: 'No podés eliminar tu propio usuario',
      });
    }

    const user = await User.findOne({ _id: id, deletedAt: null });
    if (!user) {
      return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });
    }

    // Eliminación lógica
    user.deletedAt = new Date();
    await user.save();

    // Cascada: eliminar los eventos que organizó
    await Event.deleteMany({ organizer: id });

    return res.status(200).json({
      ok: true,
      message: 'Usuario eliminado correctamente junto con sus eventos',
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};