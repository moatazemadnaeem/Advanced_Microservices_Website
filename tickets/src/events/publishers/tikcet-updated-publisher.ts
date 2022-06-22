import {Publisher,TicketUpdatedStruct,Subjects} from '@ticketing_app/common_code'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedStruct>{
    subject:Subjects.TicketUpdated=Subjects.TicketUpdated
}
