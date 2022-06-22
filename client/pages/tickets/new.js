import React,{useState} from 'react'
import Handelrequest from '../../hooks/request'
import Router from 'next/router'

const NewTicket=()=>{
    const [title,setTitle]=useState('')
    const [price,setPrice]=useState('')
    const {errors,DoReq}=Handelrequest({
        url:'/api/tickets',
        method:'post',
        body:{
            title,price
        },
        OnSuccess:()=>Router.push('/'),
    })
    const onBlur=()=>{
        const value=parseFloat(price)

        if(isNaN(value)){
            return;
        }

        setPrice(value.toFixed(2))
    }
    const onSubmit=(e)=>{
        e.preventDefault()

        DoReq()
    }
  return (
    <div>
        <h1>Create a ticket</h1>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
                <label>Title</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} className='form-control'/>
            </div>
            <div className='form-group'>
                <label>Price</label>
                <input value={price} onChange={(e)=>setPrice(e.target.value)} onBlur={onBlur} className='form-control'/>
            </div>
            {errors}
            <button style={{marginTop:'10px'}} className='btn btn-primary'>Submit</button>
        </form>
    </div>
  )
}

export default NewTicket