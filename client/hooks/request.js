import React,{useState} from 'react';
import axios from 'axios'
function Handelrequest({url,method,body,OnSuccess}) {
    const [errors,seterrors]=useState(null)

    const DoReq=async(props)=>{
        try{
            seterrors(null)
            const response=await axios[method](url,{
                ...body,...props
            })
            if(OnSuccess){
                OnSuccess(response.data)
            }
            return response.data;
        }catch(err){
            seterrors(<div className='alert alert-danger'>
            <h4>Ooops....</h4>
             <ul className='my-0'>
                 {err.response.data.errors.map(err=><li key={err.message}>{err.message}</li>)}
             </ul>
         </div>)
        }
    }

    return {errors,DoReq}
}

export default Handelrequest;
