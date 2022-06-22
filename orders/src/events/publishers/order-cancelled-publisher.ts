import {OrderCancelledStruct,Subjects,Publisher} from '@ticketing_app/common_code'

export class OrderCancelledPublisher extends Publisher<OrderCancelledStruct>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled
}