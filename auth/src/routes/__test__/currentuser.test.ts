import request from 'supertest'
import { app } from '../../app'
import {getcookie} from '../../test/helperauth'
it('returns a user on successful signup',async()=>{
  
    const cookie=await getcookie()
    const user=  await request(app)
    .get('/api/users/current-user')
    .set('Cookie',cookie)
    .expect(200)
    expect(user.body.currentUser.email).toEqual('moataz@test.com')
})
it('returns null if user not loged in',async()=>{
    const user=  await request(app)
    .get('/api/users/current-user')
    .expect(200)
    expect(user.body.currentUser).toEqual(null)
})