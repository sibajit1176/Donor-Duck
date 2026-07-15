const {Cashfree, CFEnvironment,}=require('cashfree-pg')

const cappId="TEST430329ae80e0f32e41a393d78b923034"
const secretKey="TESTaf195616268bd6202eeb3bf8dc458956e7192a85"

const cashfree=new Cashfree(
    CFEnvironment.SANDBOX,
    cappId,
    secretKey
)


module.exports=cashfree