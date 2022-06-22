import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
const startDB=async()=>{
    if(!process.env.JWT_KEY){
        throw new Error('Jwt is not defined')
    }
    if(!process.env.MONGO_URI){
        throw new Error('Mongo Uri is not defined')
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID Uri is not defined')
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID Uri is not defined')
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL Uri is not defined')
    }
    try{
        //connect to nats...
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed')
            process.exit()
        })
        process.on('SIGINT',()=>natsWrapper.client.close())
        process.on('SIGTERM',()=>natsWrapper.client.close())
        
        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to db')
    }catch (err){
        console.log(err,'err to connect')
    }

    app.listen(3000,()=>{
        console.log('listening in port 3000')
    })
}
startDB()