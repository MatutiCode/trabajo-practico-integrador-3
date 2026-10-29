import { body } from 'express-validator';

const onlyLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

export const profileRules = [
  body('profile.firstName')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(onlyLetters).withMessage('El nombre solo puede contener letras'),
  body('profile.lastName')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
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

export const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('El username es obligatorio')
    .isLength({ min: 3, max: 20 }).withMessage('El username debe tener entre 3 y 20 caracteres')
    .isAlphanumeric().withMessage('El username solo puede ser alfanumérico'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Email no válido'),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('La contraseña debe tener al menos una mayúscula')
    .matches(/[a-z]/).withMessage('La contraseña debe tener al menos una minúscula')
    .matches(/\d/).withMessage('La contraseña debe tener al menos un número'),
  ...profileRules,
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Email no válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];