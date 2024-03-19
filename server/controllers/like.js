  import videoFiles from "../models/videoFiles.js";
  import mongoose from "mongoose";
import { io } from "../socket/socket.js";

  export const likeContoller = async(req,res)=>{
      const {id:_id} = req.params;
      const {Like} = req.body;

      if (!mongoose.Types.ObjectId.isValid(_id)) {
          return res.status(404).send("Chanel Unavailable..");
        }
        try {
          const updateLike = await videoFiles.findByIdAndUpdate(
            _id,
            {
              $set: {
                "Like": Like, }
            },
            {new: true}
          )
          console.log("Liked Video",updateLike);
          io.emit('updateLikes', _id);
          res.status(200).json(updateLike)
        }
        catch(error){
          res.status(400).json("error: ",error)

        }
  };