import React,{useState} from 'react';
import Handelrequest from '../../hooks/request';
import Router from 'next/router'
function signup() {
    const [email,setemail]=useState('')
    const [password,setpassword]=useState('')
    const {errors,DoReq}=Handelrequest({
        url:'/api/users/signup',
        method:'post',
        body:{
            email,password
        },
        OnSuccess:()=>Router.push('/')
    })
    const submit=async(e)=>{
        e.preventDefault()
        DoReq()
    }
  return <form onSubmit={submit}>
        <div className='form-group'>
            <h1>Sign up</h1>
        <label>Enter Your Email</label>
        <input className='form-control' type='text' onChange={(e)=>{
            setemail(e.target.value)
        }}/>
        </div>
        <div className='form-group'>

        <label>Enter Your Password</label>
        <input className='form-control' type='password' onChange={(e)=>{
            setpassword(e.target.value)
        }}/>
        </div>
        
        {errors}
       
        <button style={{marginTop:'10px'}} className='btn btn-primary'>Submit</button>
  </form>;
}

export default signup;
