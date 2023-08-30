const nodemailer = require("nodemailer");
const moment = require("moment");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "localhost",
  port: 587,
  secure: true,
  auth: {
    user: "sudharsanvankayala@gmail.com",
    pass: "gaklglbxagypjmzu",
  },
});

exports.SendSingUpOtp = async (req, res) => {
    const otp = req;
  try {
    const mailOptions = {
      from: "sudharsanvankayala@gmail.com",
      to: req.body.email_address,
      subject: "First Fitness Otp",
      text:`Dear User ${otp.otp} to Verify Your Acount`
    };
    await transporter.sendMail(mailOptions);
  } catch (e) {
    console.log("error uccoured in sending mail for welcome");
  }
};

exports.forgetPassword = async(req,res)=>{
    const otp = req;
    try {
      const mailOptions = {
        from: "sudharsanvankayala@gmail.com",
        to: req.body.email_address,
        subject: "Forget Password Otp",
        html: `<!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Bree+Serif&family=Caveat:wght@400;700&family=Lobster&family=Monoton&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display+SC:ital,wght@0,400;0,700;1,700&family=Playfair+Display:ital,wght@0,400;0,700;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Source+Sans+Pro:ital,wght@0,400;0,700;1,700&family=Work+Sans:ital,wght@0,400;0,700;1,700&display=swap');
                .bg-cont {
                    background-image: url('https://t4.ftcdn.net/jpg/03/98/17/39/360_F_398173959_bFbdapwjW7uahAeYtVe7dD5RLJtvuVGM.jpg');
                    text-align: center;
                    padding: 40px;
                    border-radius: 20px;
                    background-size: cover;
                    
                }
        
                .juciyimg {
                    border-radius: 20px;
                }
        
                .img1 {
                    height: 90px;
                    width: 90px;
                    border-radius: 20px;
                    margin-right: 40px;
                    text-align: center;
                    margin-left: 50px;
                    margin-top: 30px;
                }
        
                .head {
                    font-family: Fantasy;
                    color: #ffffff;
                    font-weight: bold;
                    margin-top: 0px;
                    font-size: 16px;
                    font-style: italic;
                    margin-top: 20px;
                    text-align: center;
                }
        
                .fixtheposition {
                    display: flex;
                }
                .fixtheposition2 {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 50px;
                }
        
                .head2 {
                    font-family: Fantasy;
                    color: #ffffff;
                    font-weight: bold;
                    font-size: 18px;
                    font-style: italic;
                   
                    text-align: center;
                }
               
                .tp {
                    font-family: Roboto;
                    color: #ffffff;
                    font-weight: bold;
                    font-size: 16px;
                    margin-top: 20px;
                }
                .otp-cont{
                  background-color: Red;
                  border-radius: 5px;
                  padding: 3px;
                 
                }
            </style>
        </head>
        
        <body>
            <diV class="bg-cont">
                

                    <h1 class="head2">You Are Requested To Reset The Password Of Your First Fitness Account</h1>
              
               
                    <h1 class="tp">
                        Please Use This Security Code <span class="otp-cont">${otp.otp}</span> To Reset Your Password Which is Valid Upto 15 Minutes
                    </h1>
                    <h1 class="head">
                        To Avoid Security Issues Please Don't Share This Code With Any One
                    </h1>
                    
               
            </diV>
        </body>
        </html>`,
      };
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log("error uccoured in sending mail for Forget Password");
      console.log(e);
    }
}

