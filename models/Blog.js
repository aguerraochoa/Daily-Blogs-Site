import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: mongoose.Schema.Types.ObjectId,
})

const Blogs = mongoose.model('Blogs', BlogSchema);

export { Blogs };