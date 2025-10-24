import mongoose from 'mongoose'
import mongoos, { mongo } from 'mongoose'
/*
const orderItemsSchema = mongoose.Schema({
    productId: {
        typeof: mongoose.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        typeof: Number,
        required: true
    }
}, { timestamps: true })
*/

const orderSchema = new mongoos.Schema({

    orderPrice: {
        typeof: Number,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // orderItems: {
    //     type: [orderItemsSchema]
    // }

    address: {
        tyepof: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CANCELLED', 'DELIVERED'],
        default: 'PENDING'
    }
}, { timestamps: true })
export const Order = mongoos.model('Order', orderSchema)

