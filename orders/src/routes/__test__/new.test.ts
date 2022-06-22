import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order ,add} from '../../models/order';
import { Ticket ,addTicketOrder} from '../../models/ticket';
import {OrderStatus} from '@ticketing_app/common_code'
import {getcookie} from '../../test/helperauth'
import {natsWrapper} from '../../nats-wrapper'
it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getcookie())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket =addTicketOrder({
    title: 'concert',
    price: 20,
    id:new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();
  const order = add({
    ticket,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getcookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket =addTicketOrder({
    title: 'concert',
    price: 20,
    id:new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getcookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event',async()=>{
  const ticket =addTicketOrder({
    title: 'concert',
    price: 20,
    id:new mongoose.Types.ObjectId().toHexString()
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getcookie())
    .send({ ticketId: ticket.id })
    .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
});
