import request from 'supertest'
import { app } from '../../app'


it('returns a 201 on successful signup',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(201)
})

it('returns a 400 on invalid email',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'testtest.com',
        password:'password'
    })
    .expect(400)
})

it('returns a 400 on invalid password',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'p'
    })
    .expect(400)
})
it('returns a 400 on missing email or password',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400)
})
it('disallow to signup again with same email',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(201)
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(400)
    
})
it('sets a cookie after signup',async()=>{
   const res= await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(201) 
    expect(res.get('Set-Cookie')).toBeDefined()
})