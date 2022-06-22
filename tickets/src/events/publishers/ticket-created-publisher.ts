import {Publisher,TicketCreatedStruct,Subjects} from '@ticketing_app/common_code'

export class TicketCreatedPublisher extends Publisher<TicketCreatedStruct>{
    subject:Subjects.TicketCreated=Subjects.TicketCreated
}
