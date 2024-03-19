import http from 'http';
import { Server } from "socket.io"
import express from 'express';


const app=express()
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin:"http://localhost:3000",
        methods:["GET","POST"],
    }
});


io.on('connection', (socket)=>{
    console.log('user connected',socket.id);

    socket.on('disconnect',()=>{
        console.log("user disconnected",socket.id)
    })
   
    socket.on('newVideo',(newVideo)=>{
        io.emit('newVideo',newVideo);
    })

    socket.on('updateLikes', ({videoId}) => {
        io.emit('updateLikes', videoId);
      });

      socket.on('updateDeleteLikes', (videoId) => {
        io.emit('updateDeleteLikes', videoId);
      });

      socket.on('updateViews',(data)=>{
        io.emit('updateViews',data)
      })

      
  socket.on('newComment', (newComment) => {
    io.emit('newComment', newComment);
  });

      socket.on('editComment',async (updateComment)=>{
        io.emit('editComment',updateComment);
      });

      socket.on('deleteComment',(commentId)=>{
        io.emit('deleteComment',commentId);
      });

})


export {app,io,server}

