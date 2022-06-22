import request from 'supertest'
import { app } from '../../app'

it('fails when supply email does not exist',async()=>{
    await request(app)
    .post('/api/users/signin')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(400)
})
it('fails when supply incorrect password',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(201)
    await request(app)
    .post('/api/users/signin')
    .send({
        email:'test@test.com',
        password:'paasdasdssword'
    })
    .expect(400)
})
it('should respond with a cookie after signing in',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(201)
   const res= await request(app)
    .post('/api/users/signin')
    .send({
        email:'test@test.com',
        password:'password'
    })
    .expect(200)
    expect(res.get('Set-Cookie')).toBeDefined()
})