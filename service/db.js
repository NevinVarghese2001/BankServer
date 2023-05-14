const mongoose=require("mongoose")

//connection string
mongoose.connect("mongodb://127.0.0.1:27017/bankServer",{useNewUrlParser:true})

//model
const User=mongoose.model("User",
{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})

module.exports={
    User
}