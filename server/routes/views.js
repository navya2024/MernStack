import mongoose from "mongoose";
import videoFiles from "../models/videoFiles.js";
import {io} from "../socket/socket.js"

export const viewController = async(req,res) =>{
    const {id:_id} = req.params;
    console.log(_id);
    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("Video Unavailable");
    }

    try{
        const file = await videoFiles.findById(_id);
        const views = file.Views;
        const updateview = await videoFiles.findByIdAndUpdate(
            _id,
            {
                $set:{Views: views + 1 }
            }
        )
        io.emit('updateViews',{videoId:_id,views:updateview.Views});
        res.status(200).json(updateview);
    }
    catch(error){
        res.status(400).json("error: ",error)
    }
}