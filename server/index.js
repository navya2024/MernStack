import express from "express"
import mongoose from "mongoose"
import dontenv from "dotenv"
import bodyParser from "body-parser"
import userRoutes from './routes/user.js'
import videoRoutes from './routes/video.js'
import  commentsRoutes from './routes/comments.js'
import cors from 'cors'
import path from 'path'

const app=express()

app.use(cors())

dontenv.config()

app.get('/',(req,res)=>{
    res.send("hello")
})
app.use(bodyParser.json())
app.use('/user',userRoutes)
app.use('/video',videoRoutes)
app.use('/comment',commentsRoutes)

app.use(express.json({limit:'30mb',extended:true}));
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use('/uploads',express.static(path.join('uploads')))

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server Running on the PORT ${PORT}`)
})

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

const DB_URL = process.env.CONNECTION_URL
mongoose.connect(DB_URL,options).then(()=>{
    console.log("MongoDB database connected")
}).catch((error)=>{
    console.log(error);
})