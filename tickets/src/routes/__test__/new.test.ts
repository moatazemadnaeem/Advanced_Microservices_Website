import request from 'supertest'
import { app } from '../../app'
import {getcookie} from '../../test/helperauth'
import {Tickets} from '../../models/tickets'
import {natsWrapper} from '../../nats-wrapper'
it('should have post req to /api/tickets to create a ticket',async()=>{
    const respone=await request(app).post('/api/tickets').send({});
    expect(respone.status).not.toEqual(404);
})
it('can only be accessed if the user signed in or authenticated',async()=>{
    const respone=await request(app).post('/api/tickets').send({});
    expect(respone.status).toEqual(401);
})
it('returns a status other than 401 if the user is signed in',async()=>{
    const respone=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({});
    console.log(respone.status)
    expect(respone.status).not.toEqual(401);
})
it('return an error if the title not provided',async()=>{
    const responetit=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({price:10});
    expect(responetit.status).toEqual(400);
    const respone=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'',price:10});
    expect(respone.status).toEqual(400);

})
it('return an error if the price not provided',async()=>{
    const responetit=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:-10});
    expect(responetit.status).toEqual(400);
    const respone=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck'});
    expect(respone.status).toEqual(400);
})
it('create a ticket with a valid inputs',async()=>{
    let ticket=await Tickets.find({})
    expect(ticket.length).toEqual(0)
    const respone=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:10}).expect(201);
    ticket=await Tickets.find({})
    expect(ticket.length).toEqual(1)
})
it('publishes an event',async()=>{
    const respone=await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:10}).expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})