import mongoose from 'mongoose'

interface PaymentAttrs{
   orderId:string;
   stripeId:string;
}

interface PaymentDoc extends mongoose.Document{
    orderId:string;
    stripeId:string;
}

const PaymentSchema=new mongoose.Schema({
    orderId:{
        type:String,
        required:true
    },
    stripeId:{
        type:String,
        required:true
    },
   
},{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
        }
    }
})


export const Payments =mongoose.model('payment',PaymentSchema)
export const addPayment=(attrs:PaymentAttrs):PaymentDoc=>{
    return new Payments(attrs)
}