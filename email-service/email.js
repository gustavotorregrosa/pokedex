const nodemailer = require("nodemailer");

class EmailService {

    sendEmail(mailOptions){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
               user: "gustavo.torregrosa@gmail.com",
               pass: '...'
            }
         });
        
         
         transporter.sendMail(mailOptions, function(error, info){
            if(error){
               console.log(error);
            }else{
               console.log("Email sent: " + info.response);
            }
         });
    }

}

module.exports = EmailService;



