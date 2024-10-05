const nodemailer = require("nodemailer")

const mailSender= async(email,title,body)=>{
        try{
            let transporter= nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            })
            let info = await transporter.sendMail({
                from : 'Talk Me',
                to:`${email}`,
                subject:`${title}`,
                html:`${body}`,
    
            })
            console.log("info",info);
            return info;
        }catch(error){
            console.log("error in sending email",error)
        }
}

module.exports = mailSender;