import express,{Request,Response} from 'express'
import { Order } from '../models/order';
import {logedin,BadReqErr,NotAuth,notfound} from '@ticketing_app/common_code'
const show_orders=express.Router()

show_orders.get('/api/orders/:orderId'
,logedin,async(req:Request,res:Response)=>{
 
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
            throw new notfound();
    }
    if (order.userId !== req.currentUser!.id) {
            throw new NotAuth('You should be loged in');
    }
    res.send(order);
})
export {show_orders}