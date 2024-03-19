import videoFiles from "../models/videoFiles.js"
import { io } from "../socket/socket.js";
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export const uploadVideo = async (req, res, next) => {
  if (req.file === undefined) {
    res.status(405).json({ message: "Please upload a '.mp4' video file only" });
  } else {
    try {
            const originalVideoFilePath = req.file.path;
      const { croppingParams, colorTone, isMuted , segments} = req.body;
      
      let modifiedVideoFilePath = originalVideoFilePath;
      let ffmpegCommand = ffmpeg(originalVideoFilePath);
      
      
       // Cropping the video if cropping parameters are provided
      //  if (croppingParams && croppingParams.width > 0 && croppingParams.height > 0) {
      //   modifiedVideoFilePath = `${originalVideoFilePath}_cropped.mp4`;
      //   const cropFilter = `crop=${croppingParams.width}:${croppingParams.height}:${croppingParams.x}:${croppingParams.y}`;
      //   ffmpegCommand = ffmpegCommand.outputOptions([`-vf`, cropFilter]);
      // }
      // console.log('Output file path:', modifiedVideoFilePath); // Debugging statement

      
      if (isMuted) {
        modifiedVideoFilePath = `${originalVideoFilePath}_muted.mp4`;
        ffmpegCommand = ffmpegCommand.outputOptions(["-an"]);
      }
            // const modifiedVideoNewFilePath = `${originalVideoFilePath}_modified.mp4`;

      await new Promise((resolve, reject) => {
        ffmpegCommand
          .on("end", () => resolve())
          .on("error", (err) => reject(err))
          .save(modifiedVideoFilePath);
      });
      
      const file = new videoFiles({
        videoTitle: req.body.title,
        fileName: req.file.originalname,
        filePath: modifiedVideoFilePath,
        fileType: req.file.mimetype,
        fileSize: fs.statSync(modifiedVideoFilePath).size,
        videoChanel: req.body.chanel,
        Uploder: req.body.Uploder,
      });

      await file.save();

      io.emit("newVideo", file);

      const resolutions = [
        { name: "320p", size: "320x240" },
        { name: "480p", size: "640x480" },
        { name: "720p", size: "1280x720" },
        { name: "1080p", size: "1920x1080" },
      ];

      const ffmpegPromises = resolutions.map(({ name, size }) => {
        const resolutionFilePath = path.join(
          "uploads",
          `${Date.now()}-${name}-${req.file.originalname}`
        );

        return new Promise((resolve, reject) => {
          ffmpeg(modifiedVideoFilePath)
            .output(resolutionFilePath)
            .size(size)
            .on("end", () => {
              console.log(`${name} conversion completed`);
              file[`filePath_${name}`] = resolutionFilePath;
              resolve();
            })
            .on("error", (err) => reject(err))
            .run();
        });
      })

      await Promise.all(ffmpegPromises);

      await file.save();

      return res.status(201).json("Succesfull");


    } catch (error) {
      res.status(400).send(error.message);
    }
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const files = await videoFiles.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
