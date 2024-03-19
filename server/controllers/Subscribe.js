
import users from "../models/user.js";

export const subscribeController = async (req, res) => {
    const {chanelId: chanelId, userId:userId} = req.body;

    try {
        const user = await  users.findByIdAndUpdate(
            userId,
            {
                $addToSet: {subscribedChanels:chanelId}
            },
            {new:true}
        );
        res.json(user.subscribedChanels);
        
    }
    catch (error) {
        console.log(error);
        res.json(500).json({message:"Internal Error"})

    }
}

 export const unsubscribeController = async (req, res) => {
    const {chanelId: chanelId, userId:userId} = req.body;

    try {
        const user = await  users.findByIdAndUpdate(
            userId,
            {
                $pull: {subscribedChanels:chanelId}
            },
            {new:true}
        );
        res.json(user.subscribedChanels);
       
    }
    catch (error) {
        console.log( error);
        res.json(500).json({message:"Internal Error"})

    }
}

// controllers/Subscribe.js

export const subscriptionStatusController = async (req, res) => {
    const { chanelId, userId } = req.body;
  
    try {
      const user = await users.findById(userId);
  
      if (user.subscribedChanels.includes(chanelId)|| user._id === chanelId) {
        res.json({ isSubscribed: true });
      } else {
        res.json({ isSubscribed: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Error", isSubscribed: false });
    }
  };
  