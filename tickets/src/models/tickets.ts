import mongoose from 'mongoose'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
//Interface the define what ticket should look like
interface TicketsAttrs{
    title:string;
    price:number;
    userId:string;
}
//Interface that define what will come back after creating new ticket
export interface TicketsRes extends mongoose.Document{
    title:string;
    price:number;
    userId:string;
    orderId?:string;
    version:number;
}

//please be aware that mongoose add extra fields in the document like created at for example so we make sure that we have those extra fileds and an object that conatin the returned doc
const Ticketsschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true,
    },
    orderId:{
        type:String,
    }
   
},
{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
}
);
Ticketsschema.set('versionKey','version')
Ticketsschema.plugin(updateIfCurrentPlugin)

export const Tickets=mongoose.model('ticket',Ticketsschema)
export const add=(attrs:TicketsAttrs):TicketsRes=>{
return new Tickets(attrs)
}
