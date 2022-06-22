import mongoose from 'mongoose'
import { app } from './app'
const startDB=async()=>{
    console.log('starting up auth service...')
    if(!process.env.JWT_KEY){
        throw new Error('Jwt is not defined')
    }
    try{
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
        console.log('connected to db')
    }catch (err){
        console.log(err,'err to connect')
    }

    app.listen(3000,()=>{
        console.log('listening in port 3000')
    })
}
startDB()