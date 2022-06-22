import styles from '../styles/tickets/new.module.css'
import Router from 'next/router'

const landing=({currentUser,tickets})=>{
   const values=tickets.map((item)=>{
       return(
           <div style={{cursor: 'pointer'}} onClick={()=>Router.push('/tickets/[ticketId]',`/tickets/${item.id}`)} className={`btn-primary ${styles.ticketContainer}`} key={item.id}>
               <div className={styles.ticketInfo}>
               <span style={{fontSize:'20px'}}>Title: {item.title}</span>
               <span style={{fontSize:'20px'}}>Price: {item.price}$</span>
               </div>
           </div>
       )
   })
   return(
    <div>
        {values}
   </div>
   )
}

landing.getInitialProps=async(context,client,currentUser)=>{

   const {data}=await client.get('/api/tickets').catch((err)=>{
       console.log(err)
   })

   return{tickets:data}
}

export default landing