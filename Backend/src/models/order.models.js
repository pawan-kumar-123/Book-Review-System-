import mongoos from 'mongoose'
const orderSchema = new mongoos.Schema({
    
}, { timestamps: true })
export const Order = mongoos.model('Order', orderSchema)
