import mongoos from 'mongoose'
const categorySchema = new mongoos.Schema({

}, { timestamps: true })
export const Category = mongoos.model('Category', categorySchema)