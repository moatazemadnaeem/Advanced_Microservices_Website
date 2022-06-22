import React,{useState,useEffect} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Handelrequest from '../../hooks/request'
import Router from 'next/router'

function OrderShow({order,currentUser}) {
    const [timeLeft,setTimeLeft]=useState('')
    const {errors,DoReq}=Handelrequest({
        url:'/api/payments',
        method:'post',
        body:{
           orderId:order.id
        },
        OnSuccess:()=>Router.push('/orders')
    })
    useEffect(()=>{
        const getTimeLeft=()=>{
            const tLeft=new Date(order.expiresAt) - new Date()

            setTimeLeft(Math.round(tLeft/1000))
        }
        getTimeLeft()
        const intervalId= setInterval(getTimeLeft,1000)
        return()=>{
            clearInterval(intervalId)
        }
    },[order])
    if(timeLeft<0){
        return (
            <div>
                <h3>Order Expired</h3>
            </div>
        )
    }
  return (
    <div>
        <h3>you have {timeLeft} seconds left to pay for this order</h3>
        <StripeCheckout token={(token)=>DoReq({token:token.id})} amount={order.ticket.price*100} stripeKey='pk_test_51I4BCXAwGqqor8yU8oQ9YRzf53kgVZJO1dpKQxBhVDVqgZQ7zuan4pKovltDUNK2C7GdE5pTQmyVlowpl73RQBiO00IJ14qYLK' email={currentUser.email}/>
        {errors}
    </div>
  )
}
OrderShow.getInitialProps=async(context,client,currentUser)=>{
    const {orderId}=context.query
    const {data}=await client.get(`/api/orders/${orderId}`).catch((err)=>{
        console.log(err)
    })
 
    return{order:data}
 }
export default OrderShow