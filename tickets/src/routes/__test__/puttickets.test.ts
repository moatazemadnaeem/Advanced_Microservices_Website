import request from 'supertest'
import { app } from '../../app'
import {getcookie} from '../../test/helperauth'
import mongoose from 'mongoose'
import {Tickets} from '../../models/tickets'
import {natsWrapper} from '../../nats-wrapper'

it('returns 404 because the ticket not found',async()=>{
   
    const id=new mongoose.Types.ObjectId().toHexString();
    await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie',getcookie())
    .send({
        title:'hello',
        price:10
    })
    .expect(404)
})
it('returns 401 because the user is not auth',async()=>{
   
    const id=new mongoose.Types.ObjectId().toHexString();
     await request(app)
    .put(`/api/tickets/${id}`)
    .send({
        title:'hello',
        price:10
    })
    .expect(401)
})
it('returns 401 because the user does not own the ticket',async()=>{
   
    const res=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:10}).expect(201);
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',getcookie())
    .send({
        title:'hello',
        price:1000
    })
    .expect(401)
})

it('return an error if the title not provided',async()=>{
    const cookie=getcookie();
    const res=await request(app).post('/api/tickets').set('Cookie',cookie).send({title:'chunck',price:10}).expect(201);
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'',
        price:1000
    })
    .expect(400)
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        price:1000
    })
    .expect(400)

})
it('return an error if the price not provided',async()=>{
    const cookie=getcookie();
    const res=await request(app).post('/api/tickets').set('Cookie',cookie).send({title:'chunck',price:10}).expect(201);
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'title',
        price:-1000
    })
    .expect(400)
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'title',
    })
    .expect(400)
})
it('create a ticket with a valid inputs',async()=>{
    const cookie=getcookie();
    const res=await request(app).post('/api/tickets').set('Cookie',cookie).send({title:'chunck',price:10}).expect(201);
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'title',
        price:1000
    })
    .expect(200)
  const ticket=  await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200)
    expect(ticket.body.title).toEqual('title')
    expect(ticket.body.price).toEqual(1000)
})
it('publishes an event after updating',async()=>{
    const cookie=getcookie();
    const res=await request(app).post('/api/tickets').set('Cookie',cookie).send({title:'chunck',price:10}).expect(201);
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'title',
        price:1000
    })
    .expect(200)
  const ticket=  await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200)
    expect(ticket.body.title).toEqual('title')
    expect(ticket.body.price).toEqual(1000)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
it('should reject an edit if the ticket is reserved',async()=>{
    const cookie=getcookie();
    const res=await request(app).post('/api/tickets').set('Cookie',cookie).send({title:'chunck',price:10}).expect(201);
    const ticket=await Tickets.findById(res.body.id)
    ticket.set({orderId:new mongoose.Types.ObjectId().toHexString()})
    await ticket.save()
    await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie',cookie)
    .send({
        title:'title',
        price:1000
    })
    .expect(400)
  
})