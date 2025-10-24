import mongoos from 'mongoose'
const categorySchema = new mongoos.Schema({
    name: {
        typeof: String,
        required: true
    }
}, { timestamps: true })
export const Category = mongoos.model('Category', categorySchema)