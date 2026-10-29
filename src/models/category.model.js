import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 30 },
    description: { type: String, trim: true, maxlength: 200 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate: eventos que tienen esta categoría en su array
categorySchema.virtual('events', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'categories',
});

export default mongoose.model('Category', categorySchema);