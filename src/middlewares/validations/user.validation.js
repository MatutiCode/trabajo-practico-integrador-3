import { body, param } from 'express-validator';

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

export const userIdValidator = [
  param('id').isMongoId().withMessage('ID no válido'),
];


export const updateUserValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('El username debe tener entre 3 y 20 caracteres')
    .isAlphanumeric().withMessage('El username solo puede ser alfanumérico'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email no válido'),
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Rol no válido (user o admin)'),
  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(onlyLetters).withMessage('El nombre solo puede contener letras'),
  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(onlyLetters).withMessage('El apellido solo puede contener letras'),
  body('profile.birthDate')
    .optional()
    .isISO8601().withMessage('Fecha de nacimiento no válida')
    .custom((value) => {
      if (new Date(value) > new Date()) {
        throw new Error('La fecha de nacimiento no puede ser futura');
      }
      return true;
    }),
  body('profile.phone')
    .optional()
    .matches(/^\d{8,15}$/).withMessage('El teléfono debe tener solo números (8 a 15 dígitos)'),
];