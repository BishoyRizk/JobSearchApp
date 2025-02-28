import nodemailer from"nodemailer";


// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async({to=[],subject='confirmation',text='hello',html=''}={})=> {

    const transporter = nodemailer.createTransport({
     
        service: 'gmail', // true for port 465, false for other ports
        auth: {
          user: process.env.Email,
          pass: process.env.Email_Password,
        },
      });
      
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"job App 👻" <${process.env.Email}>`, // sender address
    to,
    subject,
    text,
    html,
  });

 return info
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


