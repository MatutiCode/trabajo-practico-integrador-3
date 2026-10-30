import { matchedData } from "express-validator";
import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.js";
import { generateToken } from "../helpers/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password, profile } = matchedData(req);

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) {
      return res.status(400).json({
        ok: false,
        message: "El username o el email ya están registrados",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profile,
    });

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req);

    const user = await User.findOne({ email, deletedAt: null });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Credenciales inválidas" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Credenciales inválidas" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 día, igual que JWT_EXPIRES_IN
    });

    return res.status(200).json({
      ok: true,
      message: "Login exitoso",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ ok: true, user: req.user });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profile } = matchedData(req);

    const user = req.user;
    Object.assign(user.profile, profile); // actualiza solo los campos enviados
    await user.save();

    return res.status(200).json({
      ok: true,
      message: "Perfil actualizado correctamente",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ ok: true, message: "Sesión cerrada correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: "Error interno del servidor" });
  }
};
