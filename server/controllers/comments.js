import comments from "../models/comments.js";
import mongoose from "mongoose";
import { io } from "../socket/socket.js";
//   ;

export const postComment = async (req, res) => {
  const CommentData = req.body;
  try {
    const postcomment = new comments(CommentData);
    await postcomment.save();
    console.log(postcomment)
    res.status(200).json("posted the comment");
    io.emit('newComment', postcomment);
    //   console.log("DOne");
  } catch (error) {
    console.log(error);
    return res.status(400).json(error)   

  }
};



export const getComment = async (req, res) => {
    try {
      const commentList = await comments.find();
      res.status(200).send(commentList);
    } catch (error) {
      res.status(404).send(error.message);
    }
  };
  
  export const deleteComment = async (req, res) => {
      const {id:_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send("Comments Unavailable..");
      }
      try {
        await comments.findByIdAndDelete(_id);
     
     io.emit('deleteComment', _id)
      res.status(200).json({ message: "deleted comment" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
        export const editComment = async (req, res) => {
            const {id:_id}=req.params;
            const {commentBody}=req.body;
            if (!mongoose.Types.ObjectId.isValid(_id)) {
                return res.status(404).send("comment Unavailable..");
              }
            try {
                const updateComment = await comments.findByIdAndUpdate(
                    _id,
                    {
                        $set: {"commentBody":commentBody}
                    },
                    {new:true}
                )
                io.emit('editComment',updateComment);
                res.status(200).json(updateComment)
            } catch (error) {
                res.status(400).json(error)
                
            }
        }