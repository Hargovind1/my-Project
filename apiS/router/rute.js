const express = require('express')
const auth= require("../middleware/auth")
const {signup,login,verifyOtp, resendOtp,forgotPassword, resetPassword,changePassword,editProfile,viewData} = require('../controller/controller');
const router = express.Router();

/**
 * @swagger
 * /user/signup:
 *   post:
 *     tags:
 *       - USER
 *     description: signup
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true
 *       - name: firstname
 *         description: firstname required.
 *         in: formData
 *         required: true
 *       - name: lastname
 *         description: lastname required.
 *         in: formData
 *         required: true
 *       - name: dob
 *         description: dob required.
 *         in: formData
 *         required: true
 *       - name: address
 *         description: address required.
 *         in: formData
 *         required: true
 *       - name: number
 *         description: number required.
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password required.
 *         in: formData
 *         required: true
 *       - name: confirm_password
 *         description: confirm_password required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully signup.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */

router.post('/signup',signup);
/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - USER
 *     description: login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully login.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */  
router.post('/login',login);
/**
 * @swagger
 * /user/verifyOtp:
 *   put:
 *     tags:
 *       - USER
 *     description: verifyOtp
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true
 *       - name: otp
 *         description: otp required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully verifyOtp.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */  
router.put('/verifyotp',verifyOtp);
/**
 * @swagger
 * /user/resendOtp:
 *   put:
 *     tags:
 *       - USER
 *     description: resendOtp
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully resendotp.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */  
router.put('/resendOtp',resendOtp);
/**
 * @swagger
 * /user/forgotPassword:
 *   put:
 *     tags:
 *       - USER
 *     description: forgotPassword
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true  
 *     responses:
 *       200:
 *         description: Thanks, You have successfully forgotPassword.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */  
router.put('/forgotPassword',forgotPassword);

/**
 * @swagger
 * /user/resetPassword:
 *   put:
 *     tags:
 *       - USER
 *     description: resetPassword
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true
 *       - name: otp
 *         description: otp required.
 *         in: formData
 *         required: true
 *       - name: newPassword
 *         description: newPassword required.
 *         in: formData
 *         required: true
 *       - name: confirm_password
 *         description: confirm_password required.
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully  resetPassword.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */

router.put('/resetPassword',resetPassword);
/**
 * @swagger
 * /user/changePassword:
 *   put:
 *     tags:
 *       - USER
 *     description: changePassword
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token required.
 *         in: header
 *         required: true
 *       - name: password
 *         description: password required.
 *         in: formData
 *         required: true
 *       - name: newPassword
 *         description: newPassword required.
 *         in: formData
 *         required: true
 *       - name: confirm_password
 *         description: confirm_password required.
 *         in: formData
 *         required: true 
 *     responses:
 *       200:
 *         description: Thanks, You have successfully changePassword.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.put('/changePassword',auth.verifyToken,changePassword)
/**
 * 
 * @swagger
 * /user/editProfile:
 *   put:
 *     tags:
 *       - USER
 *     description: editProfile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token required.
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id required.
 *         in: query
 *         required: true 
 *       - name: email
 *         description: email required.
 *         in: formData
 *         required: true   
 *       - name: firstname
 *         description: firstname required.
 *         in: formData
 *         required: true 
 *       - name: lastname
 *         description: lastname required.
 *         in: formData
 *         required: true 
 *       - name: address
 *         description: address required.
 *         in: formData
 *         required: true
 *       - name: dob
 *         description: dob required.
 *         in: formData
 *         required: true 
 *       - name: number
 *         description:  required.
 *         in: formData
 *         required: true  
 *     responses:
 *       200:
 *         description: Thanks, You have successfully edit.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */
router.put('/editProfile',auth.verifyToken,editProfile)
/**
 * @swagger
 * /user/viewData:
 *   get:
 *     tags:
 *       - USER
 *     description: viewData
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token required.
 *         in: header
 *         required: true
 *       - name: _id
 *         description: token required.
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Thanks, You have successfully viewData.
 *       500:
 *         description: Internal Server Error
 *       501:
 *         description: Something went wrong!
 */  
router.get('/viewData', auth.verifyToken,viewData)

module.exports=router