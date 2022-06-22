import mongoose from 'mongoose'
import {OrderStatus} from '@ticketing_app/common_code'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface OrderAttrs{
    id:string;
    status:string;
    version:number;
    price:number;
    userId:string;
}

interface OrderDoc extends mongoose.Document{
    status:string;
    version:number;
    price:number;
    userId:string;
}

const orderSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:Object.values(OrderStatus)
    },
    price:{
        type:Number,
        required:true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
})

orderSchema.set('versionKey','version')
orderSchema.plugin(updateIfCurrentPlugin)
export const Order =mongoose.model('order',orderSchema)
export const add=(attrs:OrderAttrs):OrderDoc=>{
    return new Order({
        _id:attrs.id,
        userId:attrs.userId,
        version:attrs.version,
        status:attrs.status,
        price:attrs.price
    })
}