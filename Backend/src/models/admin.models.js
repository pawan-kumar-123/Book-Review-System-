import mongoos from 'mongoose'
const adminSchema = new mongoos.Schema({
    userName: {
        typeof: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email: {
        typeof: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        typeof: String,
        required: true
    }
}, { timestamps: true })
export const Admin = mongoos.model('Admin', adminSchema)