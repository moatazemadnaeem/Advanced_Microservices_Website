import {Subjects} from './Subjects'

export interface mapSubjectToData{
    subject:Subjects.TicketCreated,
    data:{
        id:string;
        title:string;
        price:number;
    }
}