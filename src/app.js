const express=require('express')
const errmiddleware=require('./middlewares/errormiddleware')
const cookieParser=require('cookie-parser')
const authroute=require('./routes/auth.route')
const charityroute=require('./routes/charity.route')
const charityProjectroute=require('./routes/charityProject.route')
const donationRoute=require('./routes/donation.route')
const cors=require('cors')


const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use('/api/auth',authroute)
app.use('/api/charities',charityroute)
app.use('/api/charities/projects',charityProjectroute)
app.use('/api/charities',donationRoute)


app.use((req,res,next)=>{
    const err=new Error("Page not found")
    err.statusCode=404
    next(err)
})

app.use(errmiddleware)

module.exports=app
