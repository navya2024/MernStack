import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import users from '../models/user.js'
import nodemailer from 'nodemailer';

export const signinController = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(406).json({message:"Email and password are required"});
    }
    try {
        const alreadyExist = await users.findOne({ email });
        
        if (!alreadyExist) {
            return res.status(401).json({ message: "User does not exist" })
        }
        
        if (alreadyExist.blockedUntil && alreadyExist.blockedUntil > new Date()) {
            return res.status(403).json({ message: "Account is blocked.Try Again later" });
        }
        const PasswordCorrect = await bcrypt.compare(password, alreadyExist.password);

        if (!PasswordCorrect) {
            await failedLogin(alreadyExist);
            // console.log(alreadyExist.loginAttempts);
            return res.status(402).json({ message: "Invalid Password" })

        }

        await resetLoginAttempts(alreadyExist);

        const token = jwt.sign({
            email: alreadyExist.email,
            id: alreadyExist._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })
        res.status(200).json({ result: alreadyExist, token, message: "Login Successful" })


        async function failedLogin(alreadyExist) {
            alreadyExist.loginAttempts += 1;

            await alreadyExist.save();

            if (alreadyExist.loginAttempts === 3) {
                sendNotificationEmail(alreadyExist, 'Consecutively Failed Login Attempts for 3 times');
            }

            if (alreadyExist.loginAttempts === 5) {
                await blockedAccount(alreadyExist);
                sendNotificationEmail(alreadyExist, "Your  Account has been Blocked for 1 hr due to many failed login attempts");
            }

        }

        async function blockedAccount(alreadyExist) {
            const blockDuration = 1 * 60 * 60 * 1000;
            alreadyExist.blockedUntil = new Date(Date.now() + blockDuration);
            await alreadyExist.save();
        }

        async function resetLoginAttempts(alreadyExist) {
            alreadyExist.loginAttempts = 0;
            alreadyExist.blockedUntil = null;
            await alreadyExist.save();
        }

        function sendNotificationEmail(alreadyExist, subject) {

            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                service: process.env.SERVICE,
                auth: {
                    type: 'login',
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
                authMethod: process.env.METHOD,
            });
            const mailoptions = {
                from: {
                    name: 'Youtube Team',
                    address: process.env.USER,
                },
                to: alreadyExist.email,
                subject,
                text: `Dear ${alreadyExist.email}, \n\n${subject}\n\nSincerely,\nYoutube Team`
            };

            const sendMail = async (transporter, mailoptions) => {
                try {

                    await transporter.sendMail(mailoptions);
                    console.log("Email sent successfully");
                }
                catch (error) {
                    console.log("Email not sent" + error);
                }
            }
            return sendMail(transporter, mailoptions);
        }
    }
    catch (error) {
        console.log(error)
        res.status(404).json({ message: error });
    }


}

export const signupController = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(406).json({message:"Email and password are required"});
    }
     
    try {
        const alreadyExistUser = await users.findOne({ email });
        if (alreadyExistUser) {
            return res.status(405).json({ message: "User Already Exists" });
        }


        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await users.create({ email, password: hashPassword });
        const token = jwt.sign({
            email: newUser.email, id: newUser._id

        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })
        res.status(200).json({ result: newUser, token, message: "Register Successful" })
    }

    catch (error) {
        console.log(error)
        res.status(402).json({ message: error.message });
    }
}

