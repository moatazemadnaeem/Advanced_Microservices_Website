import  Queue  from "bull";
import {natsWrapper} from '../nats-wrapper'
import {ExpirationCompletePublisher} from '../events/publishers/expiration-complete-publishers'
interface Payload{
    orderId:string;
}
export const expirationQueue=new Queue<Payload>('order:expiration',{
    redis:{
        host:process.env.REDIS_HOST
    }
})

expirationQueue.process(async(job)=>{
    //it should publish expiration:complete event
    console.log('it should publish expiration:complete event',job.data.orderId)

    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId:job.data.orderId
    })

})