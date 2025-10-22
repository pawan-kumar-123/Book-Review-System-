import mongoos from 'mongoose'
const adminSchema = new mongoos.Schema({
    
}, { timestamps: true })
export const Admin = mongoos.model('Admin', adminSchema)