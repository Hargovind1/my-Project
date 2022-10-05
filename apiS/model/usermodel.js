const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const userSchema = new schema({

    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    address:{
        type:String,
    },
   dob:{
    type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },


otp:{
    
type:Number
},
otpvarification:{
    type:Boolean,
    default:false
},
expTime:{
    type:Number
},
number:{
    type:Number
},
userType:{
    type: String,
    enum:["ADMIN","SUBADMIN","USER"],
    default: "USER"
},
status:{
    type:String,
    enum:["ACTIVE", "BLOCK","DELETE"],
    default:"ACTIVE"
}

});
    const userModel = mongoose.model("user", userSchema);
    module.exports = userModel; 
   
   
    
    
    
    