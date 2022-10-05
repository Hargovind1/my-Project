const nodemailer=require('nodemailer')
const smtp=require('nodemailer-smtp-transport')

module.exports = {                                  

    sendMail:async(email,title,body)=>{

      console.log("===>",email,title,body)
      try {
        let transport = nodemailer.createTransport({
          host:'smtp.gmail.com',
          port:465,
          secure:true,
          auth:{
            user: "no-replymailer@mobiloitte.com",
            pass:"%FEy=9FF@",
          }
        });
        let mailResponse = await transport.sendMail({
          from:"no-replymailer@mobiloitte.com",
          to:email,
          subject:title,
          text:body, 
        });

        return mailResponse
        
      } catch (error){
        console.log("send Error====>",error)
      }
    }
  }