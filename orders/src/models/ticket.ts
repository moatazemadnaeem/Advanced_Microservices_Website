import mongoose from 'mongoose'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
interface TicketAttrs{
    title:string;
    price:number;
    id:string;
}

export interface TicketDoc extends mongoose.Document{
    title:string;
    price:number;
    version:number;
}

const TicketSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
})
TicketSchema.set('versionKey','version')
TicketSchema.plugin(updateIfCurrentPlugin)

export const Ticket=mongoose.model('Ticket',TicketSchema)

export const addTicketOrder=(attrs:TicketAttrs):TicketDoc=>{
    return new Ticket({
        _id:attrs.id,
        title:attrs.title,
        price:attrs.price
    })
}