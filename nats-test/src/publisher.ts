import nats from 'node-nats-streaming'
import {randomBytes} from 'crypto'

console.clear()
import {TicketCreatedPublisher} from './events/TicketCreatedPub'
const stan=nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
})

stan.on('connect',async()=>{
    console.log('publisher connected to NATS')
    const publisher= new TicketCreatedPublisher(stan)
   await publisher.publish({
        id:'123',
        title:'concert',
        price:20
    })
})
