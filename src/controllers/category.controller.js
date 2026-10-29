import { matchedData } from "express-validator";
import categoryModel from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        const { name, createCategory } = matchedData(req);

        const exists = await Category.findOne({ name });
        if (exists) {
            return res.status(400).json({ ok: false, message: 'Ya existe una categoria con este nombre'})
        }
        const category = await Category.create({ name, description });

        return res.status(201).json({
            ok: true,
            message: 'Categoria creada correctamente', category,
        });
    }   catch (error) {
        return res.status(500).json({ ok: false, message: 'error interno del servidor'})
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ ok: true, categories })
    }   catch (error) {
        return res.status(500).json({ok: false, message: 'error interno del servidor'});
    }
};