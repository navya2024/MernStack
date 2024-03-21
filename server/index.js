import express from "express"
import mongoose from "mongoose"
import dontenv from "dotenv"
import bodyParser from "body-parser"
import userRoutes from './routes/user.js'
import videoRoutes from './routes/video.js'
import  commentsRoutes from './routes/comments.js'
import cors from 'cors'
import path from 'path'
import {app, server } from "./socket/socket.js"


app.use(cors());

dontenv.config()

app.get('/',(req,res)=>{
    res.send("hello")
})
app.use(bodyParser.json())
app.use('/user',userRoutes)


app.use('/video',videoRoutes)
app.use('/comment',commentsRoutes)

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------


app.use(express.json({limit:'30mb',extended:true}));
app.use(express.urlencoded({limit:'30mb',extended:true}))
app.use('/uploads',express.static(path.join('uploads')))

const PORT = process.env.PORT

server.listen(PORT,()=>{
    console.log(`Server Running on the PORT ${PORT}`)
})

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4 // Use IPv4, skip trying IPv6
}

const DB_URL = process.env.CONNECTION_URL
mongoose.connect(DB_URL,options).then(()=>{
    console.log("MongoDB database connected")
}).catch((error)=>{
    console.log(error);
})



