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

export const getCategoryById = async (req, res) => {
    try {
        const { id } = matchedData(req);

        const category = await Category.findById(id).populate('events');
        if (!category) {
            return res.status(404).json({ ok: false, message: 'Categoria no encontrada'})
        }
        return res.status(200).json({ ok: true, category });
    }   catch (error) {
        return res.status(500).json({ ok: false, message: 'error interno del servidor'});
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id, name, description } = matchedData(req);

        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!category) {
            return res.status(404).json({ ok: false, message: 'Categoria no encontrada'})
        }
        const nameTaken = await Category.findOne({ name, _id: { $ne: id }})
        if (nameTaken) {
            return res.status(400).json({ ok: false, message: 'Ya existe una categoria con este nombre'})
        }
        
        category.name = name;
        category.description = description;
        await category.save();

        return res.status(200).json({ ok: true, message: 'Categoria actualziada correctamente', category,});

    }   catch (error) {
        return res.status(500).json({ ok: false, message: 'error interno del servidor'});
    }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = matchedData(req);

    // Verificación de existencia
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ ok: false, message: 'Categoría no encontrada' });
    }

    // Cascada: quitar la categoría del array categories de todos los eventos
    await Event.updateMany({ categories: id }, { $pull: { categories: id } });

    await category.deleteOne();

    return res.status(200).json({
      ok: true,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};