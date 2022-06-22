import {Subjects,Publisher,ExpirationCompleteStruct} from "@ticketing_app/common_code"


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteStruct>{
    subject: Subjects.ExpirationComplete=Subjects.ExpirationComplete
}