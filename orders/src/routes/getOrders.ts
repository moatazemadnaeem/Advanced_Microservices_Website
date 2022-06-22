import express,{Request,Response} from 'express'
import { Order } from '../models/order';
import {logedin} from '@ticketing_app/common_code'
const get_orders=express.Router()

get_orders.get('/api/orders',logedin,async(req:Request,res:Response)=>{
    const orders = await Order.find({
        userId: req.currentUser!.id,
      }).populate('ticket');
    
      res.send(orders);
})
export {get_orders}