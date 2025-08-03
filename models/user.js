const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    userData:[
        {
            date:{
                type:String,
            },
             logs:[
                    {
                        title:String,
                        time:String,
                        description:String,
                    }
                ]
        }
    ]
},{timestamps:true})

const User=mongoose.model('User',UserSchema);
module.exports=User;