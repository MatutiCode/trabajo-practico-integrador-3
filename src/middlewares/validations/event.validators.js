import mongoose from "mongoose";
import { body, param } from "express-validator";
import Category from "../../models/category.model.js";

export const eventIdValidator = [
  param("id").isMongoId().withMessage("ID no valido"),
];

export const eventValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("el titulo es obligatorio")
    .isLength({ min: 3, max: 150 })
    .withMessage("el titulo debe tener entre 3 y 150 caracteres"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("la descripcion es obligatoria")
    .isLength({ min: 20 })
    .withMessage("La descripcion debe tener al menos 20 caracteres"),
  body("startDate")
    .notEmpty()
    .withMessage("la fecha de inicio es obligatoria")
    .isISO8601()
    .withMessage("fecha de inicio no valida"),
  body("endDate")
    .notEmpty()
    .withMessage("la fecha de fin es obligatoria")
    .isISO8601("fecha no valida")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("La fecha de fin debe ser posterior a la de inicio");
      }
      return true;
    }),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("Estado no válido"),

  // Documento embebido: location
  body("location.venue")
    .trim()
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),
  body("location.address")
    .trim()
    .notEmpty()
    .withMessage("La dirección es obligatoria")
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),
  body("location.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  // Categorías (opcional): ids válidos y existentes
  body("categories")
    .optional()
    .isArray()
    .withMessage("categories debe ser un array")
    .bail()
    .custom(async (ids) => {
      if (!ids.every((id) => mongoose.isValidObjectId(id))) {
        throw new Error("Todas las categorías deben ser IDs válidos");
      }
      const unique = [...new Set(ids)];
      const count = await Category.countDocuments({ _id: { $in: unique } });
      if (count !== unique.length) {
        throw new Error("Alguna de las categorías enviadas no existe");
      }
      return true;
    }),
];
