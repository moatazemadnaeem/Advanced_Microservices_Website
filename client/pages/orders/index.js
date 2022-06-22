import React from 'react'
import styles from '../../styles/tickets/new.module.css'

function Orders({orders}) {
  return (
    <div>
        {orders.map((order)=>{
            return <div key={order.id} style={{color:'white'}} className={`${order.status==='cancelled'?'bg-danger':order.status==='created'?'bg-warning':'bg-success'} ${styles.ticketContainer}`}>
                {order.ticket.title} - {order.status}
            </div>
        })}
    </div>
  )
}
Orders.getInitialProps=async(context,client,currentUser)=>{
    const {data}=await client.get(`/api/orders`).catch((err)=>{
        console.log(err)
    })
 
    return{orders:data}
 }
export default Orders