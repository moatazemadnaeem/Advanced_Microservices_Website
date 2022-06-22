import { app } from "../app";
import request from 'supertest'

export const getcookie=async()=>{
    const res=  await request(app)
    .post('/api/users/signup')
    .send({
        email:'moataz@test.com',
        password:'password'
    })
    .expect(201)
    return res.get('Set-Cookie')
}