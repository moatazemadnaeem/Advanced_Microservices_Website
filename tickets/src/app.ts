import express from 'express'
import cookieSession from 'cookie-session'
import 'express-async-errors'
import { handelerr,notfound,ExtractPayload} from '@ticketing_app/common_code'
import { createTickets } from './routes/new'
import { showTickets } from './routes/show'
import { GetTickets } from './routes/getTickets'
import { UpdateTickets } from './routes/updateTickets'
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
app.use(ExtractPayload)
app.use(createTickets)
app.use(showTickets)
app.use(GetTickets)
app.use(UpdateTickets)
app.all('*',()=>{
    throw new notfound()
})
app.use(handelerr)