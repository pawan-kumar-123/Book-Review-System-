import mongoos from 'mongoose'
const productSchema = new mongoos.Schema({

}, { timestamps: true })
export const Product = mongoos.model('Product', productSchema)