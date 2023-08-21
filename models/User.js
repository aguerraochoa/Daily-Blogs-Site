import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    Username: String,
    Password: String,
}) 

const Users = mongoose.model('Users', UserSchema);

export { Users };