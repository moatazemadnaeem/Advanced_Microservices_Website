export const natsWrapper={
    client:{
        publish:jest.fn().mockImplementation((subject:string,data:string,callback:()=>void)=>{
            callback()
        })
    }
}

// type Arg={
//     a:string,
//     b:string
// }
// const x=(arg:Arg)=>{

// }
// const obj={
//     a:'sds',
// }
// x(obj)