import express,{Request,Response} from 'express'
import { Order } from '../models/order';
import {OrderStatus,logedin,notfound,NotAuth} from '@ticketing_app/common_code'
import { natsWrapper } from '../nats-wrapper'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
const delete_orders=express.Router()

delete_orders.delete('/api/orders/:orderId',logedin,async(req:Request,res:Response)=>{
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new notfound();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuth('You should be loged in');
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id:order.id,
      status:order.status,
      userId:order.userId,
      version: order.version,
      expiresAt:order.expiresAt.toISOString(),
      ticket:{
          id:order.ticket.id,
          price:order.ticket.price
      }
  })


    res.status(204).send(order);
})
export {delete_orders}