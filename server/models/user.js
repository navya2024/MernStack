import mongoose from "mongoose";

const userSchema =  mongoose.Schema({
    email: {type:String,require: true},
    password:{type:String,require:false},
    name:{type:String},
    desc:{type:String},
    loginAttempts:{type:Number,default:0},
    blockedUntil:Date,
    subscribedChanels:[{type:mongoose.Schema.Types.ObjectId, ref:'VideoFiles'}],
    joindeOn:{type:Date,default:Date.now},
    id: {type:String}
})

export default mongoose.model("User",userSchema);