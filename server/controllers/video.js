import videoFiles from "../models/videoFiles.js" 

export const uploadVideo = async(req,res,next)=>{
    if(req.file===undefined){
        res.status(404).json({message:"Please upload a '.mp4' video file only"});
    }
    else{
        try{
            const file = new videoFiles({
                videoTitle: req.body.title,
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: req.file.size,
                videoChanel: req.body.chanel,
                Uploder: req.body.Uploder,
            })
            console.log(file);
            await file.save();
             res.status(200).send("File Upload Successfully");
            }
            catch(error){
                res.status(400).send(error.message)
            }
        }
}

export const getAllVideos = async(req,res)=> {
        try{
            const files = await videoFiles.find();
                res.status(200).send(files);
            }
            catch (error){
                res.status(400).send(error.message);
            }


        } 