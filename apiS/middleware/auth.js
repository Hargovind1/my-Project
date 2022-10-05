const jwt = require('jsonwebtoken');
const userModel = require('../model/usermodel')
module.exports = {
    verifyToken(req, res, next) {
    try{
        if (req.headers.token) {
            jwt.verify(req.headers.token, "Mobiloitte", (err, result) => {

                if (err) {
                    if (err.name == "TokenExpiredError") {
                        return res.status(440).send({
                            responseCode: 440,
                            responseMessage: "Session Expired, Please login again.",
                        });
                    }
                    else {
                        return res.status(402).send({
                            responseCode: 402,
                            responseMessage: "Unauthorized person.",
                         });
                    }
                }
                else {
                    console.log(result)
                    userModel.findOne({ _id: result.userId}, (error, result2) => {
                        //console.log("17============",result2);
                        if (error) {
                            return next(error)
                        }
                        else if (!result2) {
                            //throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                            return res.status(404).json({
                                responseCode: 404,
                                responseMessage: "USER NOT FOUND"
                            })
                        }
                        else {
                            if (result2.status == "BLOCKED") {
                                return res.status(403).json({
                                    responseCode: 403,
                                    responseMessage: "You have been blocked by admin ."
                                })
                            }
                            else if (result2.status == "DELETE") {
                                return res.status(402).json({
                                    responseCode: 402,
                                    responseMessage: "Your account has been deleted by admin ."
                                })
                            }
                            else {
                                req.userId = result2._id;
                                  req.userDetails =   
                                next();
                            console.log("=======>54", req.userId)
                            }
                            
                        }
                    })
                }
            })
        } else {
          return res.send({responseCode:409, responseMessage:"no token found"})
        }

    
    }catch(error){
     return res.send({responseCode:409, responseMessage:"Something went wrong",responseResult:error});
    }
}
}