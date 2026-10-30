import { body, param } from "express-validator";

export const idParamValidator = [
  param("id").isMongoId().withMessage("ID no válido"),
];

export const categoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede superar los 200 caracteres"),
];
