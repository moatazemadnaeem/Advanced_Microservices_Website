import {Message} from 'node-nats-streaming'
import {Listener} from './base_listener'
import {mapSubjectToData} from './pairing/mapSubjectToData'
import {Subjects} from './pairing/Subjects'
export class TicketCreatedListener extends Listener<mapSubjectToData>{
    subject:Subjects.TicketCreated=Subjects.TicketCreated
    queueGroupName='payments'
    onMessage(data: mapSubjectToData['data'], msg: Message) {
        console.log('event data',data)

        msg.ack()
    }
}
