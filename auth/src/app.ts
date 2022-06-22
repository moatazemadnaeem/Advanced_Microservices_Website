import express from 'express'
import cookieSession from 'cookie-session'
import 'express-async-errors'
import { signup } from './routes/signup'
import { signin } from './routes/signin'
import { signout } from './routes/signout'
import { current } from './routes/current-user'
import { handelerr,notfound } from '@ticketing_app/common_code'
export const app=express()
//this line of code is to tell the server that its behind reverse proxy like nginx so now nginx can send infromation like where 
//the request is coming from for example http or https
app.set('trust proxy',true)
app.use(express.json())
//first we make the cookie not encrypted and only  allow users comming from https prot   
app.use(
    cookieSession({
        signed:false,
        secure:process.env.NODE_ENV !=='test'       
    })
)
app.use(signup)
app.use(signin)
app.use(signout)
app.use(current)
app.all('*',()=>{
    throw new notfound()
})
app.use(handelerr)