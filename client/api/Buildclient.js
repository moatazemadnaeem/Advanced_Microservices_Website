import axios from "axios";
const Client=({req})=>{

    if(typeof window ==='undefined'){
        console.log('server...')
        //this means that we excute next on the server please be aware that it's node js world so no window there
        return axios.create({
            baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers:req.headers
        })
    }
    else{
        //we excute any request from the client what happened is when compnent get rendered it's served to client 
        //it's served with all html,css,javascript and request get excuted with no domain because browser
        //is smart enough to figure out the domain
        return axios.create({
            baseURL:'',
        })
    }
}
export default Client;