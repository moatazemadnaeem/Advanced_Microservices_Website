import 'bootstrap/dist/css/bootstrap.css';
import Client from '../api/Buildclient';
import Header from '../components/Header';
const app=({ Component, pageProps ,currentUser}) => {
  return <>
  <Header currentUser={currentUser}/>
  <div className='container'>

  <Component {...pageProps} currentUser={currentUser}/>
  </div>
  
  </>

};
app.getInitialProps=async(appContext)=>{
    const client=Client(appContext.ctx);
    const {data}=await client.get('/api/users/current-user').catch((err)=>{
        console.log(err)
    })
   let pageProps={}
   if(appContext.Component.getInitialProps){
       pageProps=await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser)
   }
    return {
        currentUser:data.currentUser,
        pageProps
    }
}

export default app;
//its global css to all our components