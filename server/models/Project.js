import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String },
    preview: { type: String },
    techStack: [{ type: String }],
    github: { type: String },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
