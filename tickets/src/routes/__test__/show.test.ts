import request from 'supertest'
import { app } from '../../app'
import {getcookie} from '../../test/helperauth'
import {Tickets} from '../../models/tickets'
import mongoose from 'mongoose'


it('should return 404 if the ticket not found',async()=>{
    const id=new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .get(`/api/tickets/${id}`)
    .expect(404)
})
it('should return 200 if the ticket found',async()=>{
    let title='title'
    let price=10
    const respone= await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title,price}).expect(201);
  const ticket=  await request(app)
    .get(`/api/tickets/${respone.body.id}`)
    .send()
    .expect(200)
    expect(ticket.body.title).toEqual(title)
    expect(ticket.body.price).toEqual(price)
})