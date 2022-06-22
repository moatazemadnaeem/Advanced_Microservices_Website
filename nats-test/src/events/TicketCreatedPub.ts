import {Message} from 'node-nats-streaming'
import {Publisher} from './base_publisher'
import {mapSubjectToData} from './pairing/mapSubjectToData'
import {Subjects} from './pairing/Subjects'
export class TicketCreatedPublisher extends Publisher<mapSubjectToData>{
    subject:Subjects.TicketCreated=Subjects.TicketCreated
}
