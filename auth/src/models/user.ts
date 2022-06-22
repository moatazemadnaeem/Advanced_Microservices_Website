import mongoose from 'mongoose'

//Interface the define what user should look like
interface UserAttrs{
    email:string;
    password:string;
}
//Interface that define what will come back after creating new user
export interface UserRes extends mongoose.Document{
    email:string;
    password:string;
}
//please be aware that mongoose add extra fields in the document like created at for example so we make sure that we have those extra fileds and an object that conatin the returned doc
const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
   
},
{
    toJSON:{
        transform(doc,ret){
            ret.id=ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
}
);


export const user=mongoose.model('User',userschema)
export const add=(attrs:UserAttrs):UserRes=>{
return new user(attrs)
}
// const newuser=add({email:'any email',password:'any password'})
// newuser.email
// newuser.password