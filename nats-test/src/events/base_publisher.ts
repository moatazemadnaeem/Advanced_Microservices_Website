import {Stan} from 'node-nats-streaming'
import {Subjects} from './pairing/Subjects'
interface Event{
    subject:Subjects;
    data:any
}

export abstract class Publisher<T extends Event>{

    abstract subject:T['subject'];
    private client:Stan;
    constructor(client:Stan) {
        this.client=client;
    }
    publish(data:T['data']){
        return new Promise((resolve,reject)=>{
            this.client.publish(this.subject,JSON.stringify(data),(err)=>{
                if(err){
                  return reject(err)
                }
               return resolve(console.log('Ticket published'))
            })
        })
    }
    
}