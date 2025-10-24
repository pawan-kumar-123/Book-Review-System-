import mongoos from 'mongoose'
const userSchema = new mongoos.Schema({
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
export const User = mongoos.model('User', userSchema)

