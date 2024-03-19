import likedVideo from '../models/likedVideo.js'
import { io } from '../socket/socket.js';

export const likeVideoController = async(req,res)=>{
    const likedVideoData = req.body;

    //console.log(likedVideoData);
    const addToLikedVideo = new likedVideo(likedVideoData);

    try{
        await addToLikedVideo.save();
        res.status(200).json('added to likedVideo');
        //console.log("Done");

    }
    catch(error){
     res.status(400).json(error)   
    }
}

export const getAlllikeVideoController = async(req,res) =>{
    try{
        const files = await likedVideo.find();
        res.status(200).send(files);
    }
    catch(error) {
      console.error(error)
        res.status(500).send(error.message);
    }
}


export const deleteLikeVideoController = async (req, res) => {
    const { videoId: videoId, Viewer: Viewer } = req.params;
    try {
      await likedVideo.findOneAndDelete({
        videoId: videoId,
        Viewer: Viewer,
      });
      io.emit('updateDeleteLikes', videoId);

      res.status(200).json({ message: "Removed  from your Liked Videos" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };