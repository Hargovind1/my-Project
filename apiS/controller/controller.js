const userModel = require("../model/usermodel");
const CommonFunction = require('../Helper/CommonFunction')

const bcrypt= require('bcryptjs');
require("dotenv").config();



let otpTime = 5 * 60 * 1000;

const jwt = require('jsonwebtoken');

module.exports = {
    signup: async (req, res) => {
        try {
            const { firstname,lastname, address, dob,  email, password, confirm_password, number} = req.body
            console.log("============================>17",req.body)
            let user = await userModel.findOne({ email: email });
            console.log("===>19", user)
            let otp = generateOtp()
            if (user) {
                return res.send({ responseCode: 409, responseMessage: "user  alredy exist", responseResult: user });
            }
            else {
                if (password !== confirm_password) {
                    return res.send({ responseCode: 401, responseMesage: "password doest not match", responseresult: [] });
                }
                else {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        console.log("==========>23",salt)
                        // return;
                        const hashPassword = await bcrypt.hashSync(password)

                        console.log("===>39", hashPassword)
                        let Tittle = 'Oto Verification'
                        let body = `Your Otp is ${otp}`
                        await CommonFunction.sendMail(req.body.email, Tittle, body)

                        const doc = await userModel({ email: email})


                        const doc1 = await userModel({
                            firstname:firstname,
                            lastname:lastname,
                            dob:dob,
                            email: email,
                            address:address,
                            number: number,
                            expTime: Date.now() + otpTime,
                            password: hashPassword,
                            confirm_password: hashPassword,
                            otp: otp

                        }).save();

                        var oldPassword = hashPassword







                        const userSave = await userModel(doc1).save()
                        const token = jwt.sign({ userId: userSave._id, email: email },
                            "Moikikobiloitte", { expiresIn: "1d" })
                        console.log("===========>65", token)
                        return res.send({ responseCode: 200, responseMesage: "User is register Successfully", responsResult: userSave, token: token });

                    }

                    catch (error) {
                        console.log(error)

                    }

                }

                const userSave = await userModel.findOne({ email: email });




                if (userSave) {

                    return res.send({ responseCode: 200, responseMesage: "user register sucessfully", responseResult: userSave });

                }
            }
        }
        catch (error) {
            res.send({ responseCode: 500, responseMesage: "something went wrong", responseResult: error })

        }

    },

    verifyOtp:
    async (req, res) => {
        try {
            let user = await userModel.findOne({ email: req.body.email })
             console.log("===========>",823652)
            if (!user) {
                res.send({ responseCode: 409, responseMesage: "user already exist" })

            } else {

                if (user.otpvarification == true) {
                    console.log("==>verification")
                    res.send({ responseCode: 409, responseMesage: "user Alredy verified" })
                } else {
                    console.log(req.body.otTp);
                    console.log(user.otp);

                    if (req.body.otp == user.otp) {
                       
                        let currentTime = Date.now()
                        //let expTime = Date.now()+otpTime
                        if (currentTime <= user.expTime) {
                            console.log("hello.....")
                            let save = await userModel.findByIdAndUpdate(
                                { _id: user._id },
                                { $set: { otpvarification: true } },
                                { new: true }
                            );
                            if (save) {
                                res.send({ responseCode: 200, responseMesage: "otp verified suceessfuly", responsResult: save })
                            }
                        } else {
                            res.send({ responseCode: 403, responseMesage: "otp expired", responseResult: [] });
                        }

                    } else {
                        res.send({ responseCode: 401, responseMesage: "otp does not match", responseResult: [] });
                    }
                }
            }

        } catch (error) {
            console.log(error)
            res.send({ responseCode: 500, responseMesage: "something went wrong", responseResult: [] })
        }

    },
resendOtp: async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            res.send({ responseCode: 403, responseMesage: "user alredy exist" })
        } else {
            let otp1 = generateOtp();
            expTime = Date.now() + otpTime
            let subject = 'Otp for resend'
            let text = `your Otp Is:${otp1}`;
            let mail = await CommonFunction.sendMail(req.body.email, subject, text)
            if (mail) {
                let userSave = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: { expTime: expTime, otp: otp1 } }, { new: true });
                if (userSave) {
                    res.send({ responseCode: 200, responseMesage: "otp send successfully", responseResult: userSave })
                }
            }

        }

    } catch (error) {
        console.log(error)
        res.send({ responseCode: 404, responsMessage: "user not found", responseResult: [] })
    }
},
forgotPassword: async (req, res) => {
    try {
        let userData = await userModel.findOne({ $and: [{ email: req.body.email },], });
        if (!userData) {
            res.send({ responseCode: 404, responseMesage: "data not found", responseResult: [], });

        } else {
            let otp2 = generateOtp();
            expTime = Date.now() + otpTime
            let subject = `otp for Resend`
            let text = `your OTP is:${otp2}`;
            await CommonFunction.sendMail(req.body.email, subject, text)
            if (userData) {
                let Data = await userModel.findByIdAndUpdate({ _id: userData._id }, { $set: { expTime: expTime, otp: otp2 } }, { new: true })
                if (Data) {
                    res.send({ responseCode: 200, responsMessage: "otp send successfully", responseResult: otp2 });

                } else {
                    res.send({ responseCode: 401, responseMesage: "user not else", responsResult: [] });

                }
            } else {
                res.send({ responseCode: 401, responseMesage: "User not else", responseResult: [] });
            }
        }
    } catch (error) {
        return res.send({ responseCode: 501, responseMesage: "something went wrong", responseResult: error.message, });

    }
},

resetPassword: async (req, res, next) => {
    try {
        const { email, newPassword, confirm_password, otp } = req.body
        const user = await userModel.findOne({ email: email })
        if (!user) {
            res.send({ responseCode: 404, responseMesage: "user not found" })
        } else {
            console.log("dghjgd");
            const salt = await bcrypt.genSalt(10)

            const haspassword = await bcrypt.hash(newPassword, salt)
            console.log(haspassword);
            const currentTime = Date.now();
            if (user.otp == otp) {
                const expTime = user.expTime
                if (currentTime <= expTime) {
                    if (newPassword == confirm_password) {
                        let userUpdate = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: { password: haspassword, otpvarification: true } }, { new: true })
                        res.send({ responseCode: 200, responseMesage: "password reset successfully", responseResult: userUpdate })
                    } else {
                        res.send({ responseCode: 404, responseMesage: "password does not match" })

                    }
                } else {
                    res.send({ response: 401, responseMesage: "otp time expire" })

                }
            } else {

                res.send({ responseCode: 401, response: "wrong otp" })

            }

        }

    } catch (error) {
        res.send({ responseCode: 501, responseMesage: "something went wrong", responseResult: error })

    }

},
changePassword: async (req, res) => {
    try {
        const { password,newPassword,confirm_password} = req.body;
        console.log("===========>246",req.body)
        console.log("======>279",newPassword, password,confirm_password ) 
        const user = await userModel.findOne({ _id:req.userId,status:'ACTIVE' })
        console.log("==============>249",user)
        if (!user) {
            res.send({ responseCode: 404, responseMesage: "user not found" })
        } else {
        if (newPassword && confirm_password ){
            if (newPassword!==confirm_password) {
                res.send({ responseCode: 401, responseMesage: "password and newPassword does not match", responsResult: [] })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashnewPassword = await bcrypt.hash(newPassword, salt);
                let userUpdate = await userModel.findByIdAndUpdate({ _id: user._id }, { $set: { password: hashnewPassword} }, { new: true })
                res.send({ responseCode: 200, responseMesage: "password changed successfully", responseResult: userUpdate })
            }
           
        } else {
            res.send({ responseCode: 401, responseMessage: "both fields are require" })
        }}
    } catch (error) {
        return res.send({ responseCode: 501, responseMessage: "Something went wrong!", responseResult: error.message });
    }
},

 
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {

                const user = await userModel.findOne({ email: email})

                if (user) {
                    const isMatch = await bcrypt.compareSync(password, user.password )
                    if (email === user.email && isMatch) {

                     if (user.otpvarification==true) {
                        
                     
                        const token = await jwt.sign({ userId: user._id, email: email }, "Mobiloitte", { expiresIn: "1d" })
                        console.log("==================>109", token);


                        res.send({ responseCode: 200, responseMessage: "Login Succes", responsResult: user, token: token })
                    } else {
                        res.send({responseCode:401,responseMesage:"Before login  plz verify otp "})
                    }
                    } else {
                        res.send({ responseCode: 403, responseMessage: "Email and Password Not Valid", responsResult: [] })
                    }
                } else {
                    res.send({ responseCode: 404, responseMessage: "Data Not found" })
                }

            } else {
                res.send({ responseCode: 400, responseMessage: "All Field Are required" })

            }

        } catch (error) {
            console.log(error)
        }
    },
    editProfile: async (req,res)=>{
        try {
           const{email,firstname,number, lastname, dob, address,}=req.body
           console.log("============>313",req.body)
           const user=await userModel.findOne({_id:req.userId})
           if (!user) {
            res.send({responseCode:404,responseMesage:"user not found",responseResult:[]})
               
            
           } 

       else {
        const mail = await userModel.find({email:req.body.email})
        if(mail==user.email){
            return res.send({responseCode:404,responseMessage:"alredy exist",responseResult:[]})
        }else{
            const number=await userModel.find({number:req.body.number})
            if(number==user.number){
                return res.send({responseCode:404, responseMesage:"number exist", responseResult:[]})
            }else{
                // const userProfileUpdate=await userModel.findByIdAndUpdate({_id:user._id},{$set:req.body},{new:true});
                // return res.send({responseCode:200, responseMesage:"user profile update successfully", responseresult:userProfileUpdate})
            }
        }


        
               let userProfileUpdate=await userModel.findByIdAndUpdate({_id:user._id},{email:email,firstname:firstname,lastname:lastname,dob:dob,address:address,number:number},{new:true})
                    res.send({responseCode:200,responseMesage:"user profile update suceccfully",responseResult:userProfileUpdate})
                    console.log("=========>325",userProfileUpdate)
            
 
            
            
          }
        } catch (error) {
           res.send({responseCode:501,responseMesage:"something went wrong",responseResult:error})
        }
       },
       viewData:async (req,res)=>{
           try {
               const user=await userModel.findOne({_id:req.userId, userType:"USER", status:"ACTIVE"})
               console .log("============>327",user)
               if (!user) {
                   res.send({responseCode:404,responseMesage:"user not found",responseResult:[]})
                   // console .log("============>329",userData)
               } else {
                   res.send({responseCode:200,responseMesage:"data view successfully",responseMesage:user})
                   
               }
           } catch (error) {
             res.send({responseMesage:501, responseMesage:"something went wrong", responseMesage:[]})  
           }
       }
  


}



function generateOtp() {
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log(`Your Otp ===> ${otp}`)
    return otp
}

// app.use(express.json({ limit: "100mb" }));
// app.use(express.urlencoded({ extended: true, limit: "1000mb" }));




