import React from 'react'
import styles from '../../styles/tickets/new.module.css'
import Handelrequest from '../../hooks/request'
import Router from 'next/router'
function ShowTicket({ticket}) {

    const {errors,DoReq}=Handelrequest({
        url:'/api/orders',
        method:'post',
        body:{
           ticketId:ticket.id
        },
        OnSuccess:(order)=>Router.push('/orders/[orderId]',`/orders/${order.id}`)
    })
    const handelOrder=(e)=>{
        e.preventDefault()
        DoReq()
    }
    return (
        <div>
            <h1>Title: {ticket.title}</h1>
            <h3>Price: {ticket.price}</h3>
            {errors}
            <button onClick={(e)=>handelOrder(e)} className='btn btn-primary'>Purchase</button>
        </div>
    )
}
ShowTicket.getInitialProps=async(context,client,currentUser)=>{
    const {ticketId}=context.query
    const {data}=await client.get(`/api/tickets/${ticketId}`).catch((err)=>{
        console.log(err)
    })
 
    return{ticket:data}
 }
 
export default ShowTicket