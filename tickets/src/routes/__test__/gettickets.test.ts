import request from 'supertest'
import { app } from '../../app'
import {getcookie} from '../../test/helperauth'
//import {Tickets} from '../../models/tickets'


it('should fetch all the tickets',async()=>{
    //create three tickets to test 
    await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:10}).expect(201);
    await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:10}).expect(201);
    await request(app).post('/api/tickets').set('Cookie',getcookie()).send({title:'chunck',price:10}).expect(201);

  const res=  await request(app)
    .get('/api/tickets')
    .expect(200)
    expect(res.body.length).toEqual(3)
})