import nats,{Message, Stan} from 'node-nats-streaming'
import {randomBytes} from 'crypto'
import {TicketCreatedListener} from './events/TicketCreated'
console.clear()
const stan=nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
})

stan.on('connect',()=>{
    console.log('listener connected to NATS')
    stan.on('close',()=>{
        console.log('client stoped ');
        process.exit()
    })
    new TicketCreatedListener(stan).listen()
    
})
//this mean when we re-start or close the terminal one of those event handlers will triggered and then the client will closed
//the on close event handles will triggered and terminate everything
process.on('SIGINT',()=>stan.close())
process.on('SIGTERM',()=>stan.close())




