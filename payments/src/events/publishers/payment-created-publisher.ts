import {Subjects,PaymentCreatedStruct,Publisher} from '@ticketing_app/common_code'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedStruct>{
subject: Subjects.PaymentCreated=Subjects.PaymentCreated
}