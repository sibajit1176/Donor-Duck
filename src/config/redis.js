const Redis=require('redis')

const redisClient=new Redis({
    host:'localhost',
    port:6379
})

module.exports=redisClient