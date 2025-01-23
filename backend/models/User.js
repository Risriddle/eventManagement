const mongoose=require('mongoose')
const validator=require('validator')


const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,"Invalid Email"],
           
        },
        pwd:{
             type:String,
             required:true
        },
        isVerified:{type:Boolean ,default:false} ,
        verificationToken: { type: String },
        tokenExpiration: { type: Date },
    }
)

const User=mongoose.model('user',userSchema)
module.exports=User;