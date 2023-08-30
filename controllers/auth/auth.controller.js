const db = require('../../models/index');
const { generateOtp } = require("sendotp")
const { where, Op } = require("sequelize");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const moment = require('moment');
const response = require('../../utils/resonses')

exports.singUp = async (req, res, next) => {
  const requestDetails = req.body;
  const otp = generateOtp(4)
  try {
    const validateInputFeildsEmpty = () => {
      let errorMsg = "";
      if (
        requestDetails.user_name === undefined ||
        requestDetails.user_name === ""
      ) {
        errorMsg = "Required Data is Missing UserName Needed";
      } else if (
        requestDetails.email_address === undefined ||
        requestDetails.email_address === ""
      ) {
        errorMsg = "Required Data is Missing Email Address Needed";
      } else if (
        requestDetails.phone_number === undefined ||
        requestDetails.phone_number === ""
      ) {
        errorMsg = "Required Data is Missing Phone Number Needed";
      } else if (
        requestDetails.password === undefined ||
        requestDetails.password === ""
      ) {
        errorMsg = "Required Data is Missing Password Needed";
      }
      return errorMsg;
    };

    const findUser = await db.User.findOne({
      where:{
        email_address:requestDetails.email_address
      }
    });

    if(findUser)
    {
      return res.status(400).res.send(requestDetails.email);
    }

    const inputsError = validateInputFeildsEmpty();
    const regex1 = /^[0-9]{1,10}$/;
    const phoneNumberchecking =
      regex1.test(requestDetails.phone_number) &&
      requestDetails.phone_number.length === 10;
    const regex2 =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const isPasswordStrong = regex2.test(requestDetails.password);
    if (inputsError !== "") {
      response.onError.message = inputsError;
      res.status(400);
      res.send(response.onError);
    }
    else {
      const encryptedPassword = await bcrypt.hash(requestDetails.password, 10);
      requestDetails.password = encryptedPassword;
      const createdUser = await db.User.create(requestDetails);
      const accessToken = jwt.sign(
        {
          id: createdUser.id,
          email_address: createdUser.email_address,
          user_name: createdUser.user_name,
        },
        process.env.TOKEN_SECRET_CODE
      );
      response.onSuccess.message = "SingUp Success";
      response.onSuccess.data = accessToken;
      res.status(200);
      res.send(response.onSuccess);
      next();
    }
  } catch (e) {
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
};

exports.SendSingupOtp = async(req,res,next)=>{
  const requestDetails = req.body;
  try{
    const regex1 = /^[0-9]{1,10}$/;
    const phoneNumberchecking =
      regex1.test(requestDetails.phone_number) &&
      requestDetails.phone_number.length === 10;
    const regex2 =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const isPasswordStrong = regex2.test(requestDetails.password);

    const isMobileNumberAlreadyExist = await db.User.findOne({
      where: {
        phone_number: requestDetails.phone_number,
      },
    });
    const isMailIdAlreadyExist = await db.User.findOne({
      where: {
        email_address: requestDetails.email_address,
      },
    });
    if (!phoneNumberchecking) {
      response.onError.message =
        "Phone Number Must contain 10 Digits And all Must be Numerical Values";
      res.status(400);
      res.send(response.onError);
    } else if (!isPasswordStrong) {
      response.onError.message =
        "Password Should Have At Least Eight Characters And Must Include At Least One Special Character And One Numerical";
      res.status(400);
      res.send(response.onError);
    } else if (isMobileNumberAlreadyExist) {
      response.onError.message =
        "Phone Number Already Registered With Some User";
      res.status(400);
      res.send(response.onError);
    } else if (isMailIdAlreadyExist) {
      response.onError.message =
        "Email Address Already Registered With Some User";
      res.status(400);
      res.send(response.onError);
    }
    else{
    const otp = generateOtp(4)
    const createOtpForSingUp = await db.Singup_Otp.create({
      email_id: requestDetails.email_address,
        otp:otp
    })
    res.status(200);
    res.send({status:true,message:"Otp Sent Successfully"})
    req.otp = otp
    next()
  }
  }catch (e) {
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
}

exports.VerifySingUpOtp = async(req,res,next)=>{
  const requestDetails = req.body;
  try{
    const VeryOtp = await db.Singup_Otp.findOne({where:{
      email_id:requestDetails.email_address,
      otp:requestDetails.otp
    }})
    if(VeryOtp){
      next()
    }else{
      response.onError.message = "Invalid Otp";
    res.status(404);
    res.send(response.onError);
    }
  }catch(e){
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
}

exports.Login = async (req, res) => {
  const requestDetails = req.body;
  try {
    const validateInputFeildsEmpty = () => {
      let errorMsg = "";
      if (
        requestDetails.email_address === undefined ||
        requestDetails.email_address === ""
      ) {
        errorMsg = "Required Data is Missing Email Address Needed";
      } else if (
        requestDetails.password === undefined ||
        requestDetails.password === ""
      ) {
        errorMsg = "Required Data is Missing Password Needed";
      }
      return errorMsg;
    };
    const inputsError = validateInputFeildsEmpty();
    if (inputsError !== "") {
      response.onError.message = inputsError;
      res.status(400);
      res.send(response.onError);
    } else {
      const isUserExist = await db.User.findOne({
        where: {
          email_address: requestDetails.email_address,
        },
      });
      if (isUserExist) {
        const passwordAuth = await bcrypt.compare(
          requestDetails.password,
          isUserExist.password
        );
        if (passwordAuth) {
          const accessToken = jwt.sign(
            {
              id: isUserExist.id,
              email_address: isUserExist.email_address,
              user_name: isUserExist.user_name,
            },
            process.env.TOKEN_SECRET_CODE
          );
          response.onSuccess.message = "Login Success";
          response.onSuccess.data = accessToken
          res.status(200);
          res.send(response.onSuccess);
        }else{
          response.onError.message = "Invalid Password"
          res.status(401)
          res.send(response.onError)
        }
          
      }else {
        response.onError.message = "Incorrect Email Address No User Found Registered With That Email Address."
        res.status(401)
        res.send(response.onError)
      } 
    }
  } catch (e) {
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
};

exports.forgetPassword = async(req,res,next)=>{
  const forgetPassowrdDetails = req.body;
  const otp = generateOtp(4)
  try{
    const isUserExist = await db.User.findOne({
      where:{
        email_address:forgetPassowrdDetails.email_address
      }
    })
    if(isUserExist!==null){
      const storeOtp = await db.Otp.create({
        customer_id:isUserExist.id,
        otp:otp
      })
      response.onSuccess.message = "Otp Send To Mail Successfully You Can Reset Your Password Using That Otp"
      response.onSuccess.data = null
      res.status(200);
      res.send(response.onSuccess)
      req.otp = otp
      next()
    }
    else{
      response.onError.message = "Email Id Does Not Exist";
      res.status(400);
      res.send(response.onError);
    }
  }catch(e){
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
}

exports.resetPassword = async(req,res)=>{
  const resetPasswordDetails = req.body;
  try{
   const otpDetails = await db.Otp.findOne({
    where:{
      otp:resetPasswordDetails.otp
    }
   })
   if(otpDetails){
   const after15Minutes = moment(otpDetails.createdAt).add(15, 'minutes');
   const present = moment();
   if(present.isAfter(after15Minutes)){
    response.onError.message = "Otp Expired";
    res.status(400);
    res.send(response.onError);
   }else{
    const newPassword = await bcrypt.hash(resetPasswordDetails.new_password,10)
    const updatePassword = await db.User.update({password:newPassword},{where:{id:otpDetails.customer_id}});
    const destroyThatOtp = await db.Otp.destroy({where:{otp:resetPasswordDetails.otp}})
    response.onSuccess.message = "Reset Password Successfull"
    response.onSuccess.data = null;
    res.status(200);
    res.send(response.onSuccess);
   }
  }else{
    response.onError.message = "Invalid Otp";
    res.status(400);
    res.send(response.onError);
  }

  }catch(e){
    response.onError.message = "Something Went Wrong";
    res.status(500);
    res.send(response.onError);
    console.log(e);
  }
}