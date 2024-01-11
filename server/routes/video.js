import express from 'express'
import { uploadVideo, getAllVideos } from '../controllers/video.js';
import upload from '../Helpers/fileHelpers.js'
import {likeContoller} from '../controllers/like.js'
import {likeVideoController,getAlllikeVideoController, deleteLikeVideoController} from '../controllers/likeVideo.js'
import {watchLaterController,getAllwatchLaterController,deleteWatchLaterController} from '../controllers/watchLater.js'
import {HistoryController,getAllHistoryController,deleteHistoryController} from '../controllers/History.js'
import {viewController} from './views.js'
import auth from '../middleware/auth.js';

const routes = express.Router();
routes.post("/uploadVideo",auth,upload.single("file"),uploadVideo)
routes.get("/getvideos",getAllVideos)
routes.patch('/like/:id',auth,likeContoller);

routes.post('/likeVideo',auth,likeVideoController);
routes.get('/getAlllikeVideo',getAlllikeVideoController);
routes.delete('/deleteLikedVideo/:videoId/:Viewer',auth,deleteLikeVideoController);

routes.post('/watchLater',auth,watchLaterController);
routes.get('/getAllwatchLater',getAllwatchLaterController);
routes.delete('/deleteWatchLter/:videoId/:Viewer',auth,deleteWatchLaterController);

routes.post('/History',auth,HistoryController);
routes.get('/getAllHistory',getAllHistoryController);
routes.delete('/deleteHistory/:userId',auth,deleteHistoryController);

routes.patch('/view/:id',viewController)
export default routes; 