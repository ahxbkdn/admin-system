function sleep(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(null)
        },3000)
    })
}
sleep().then(()=>{
    console.log("hello world");
    
})