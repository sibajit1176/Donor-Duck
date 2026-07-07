const jwt = require('jsonwebtoken')

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m"
    })
}

const generaterefreshtoken=(payload)=>{
    return jwt.sign(payload,process.env.jwt.JWT_REFRESH_SECRET,{
        expiresIn:"7d"
    })
}

const verifyRefreshToken=(payload)=>{
    return jwt.verify(payload,process.env.JWT_REFRESH_SECRET)
}

module.exports={
    generateAccessToken,
    generaterefreshtoken,
    verifyRefreshToken
}