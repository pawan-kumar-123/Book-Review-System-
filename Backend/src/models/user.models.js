import mongoos from 'mongoose'
const userSchema = new mongoos.Schema({

}, { timestamps: true })
export const User = mongoos.model('User', userSchema)

