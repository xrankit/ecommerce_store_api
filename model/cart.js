import { Schema, model } from 'mongoose'
const schema = Schema
import Product from './product'
import User from './user'

const cartSchema = new schema({
    id:{
        type:Number,
        required:true
    },
    userId:{
        type:schema.Types.Number,
        ref:User,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
   products:[
        {
            productId:{
                type:schema.Types.Number,
                ref:Product,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
   ]
})

export default model('cart', cartSchema)