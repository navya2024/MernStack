import express  from "express";

import {login} from'../controllers/auth.js'
import {updateChanelData,getAllChanels} from '../controllers/Chanel.js'
import {signinController,signupController} from '../controllers/user.js';
import { subscriptionStatusController, subscribeController, unsubscribeController } from "../controllers/Subscribe.js";
import auth from '../middleware/auth.js';

const routes = express.Router();

routes.post('/login',login)
routes.post('/signIn',signinController)
routes.post('/signUp',signupController)
routes.patch('/update/:id',updateChanelData)
routes.get('/getAllChanels',getAllChanels)
routes.post('/unsubscribe',unsubscribeController);
routes.post('/subscribe',subscribeController);
routes.post('/subscriptionStatus', subscriptionStatusController);



export default routes;