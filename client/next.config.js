module.exports={
    webpackDevMiddleware:config=>{
        config.watchOptions.poll=300;
        return config;
    }
}
//in this code we tell next to poll all files in the dir 
//and render it every 300ms