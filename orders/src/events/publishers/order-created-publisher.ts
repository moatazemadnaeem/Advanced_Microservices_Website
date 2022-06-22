import {OrderCreatedStruct,Subjects,Publisher} from '@ticketing_app/common_code'

export class OrderCreatedPublisher extends Publisher<OrderCreatedStruct>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated
}