const nodemailer = require("nodemailer");
//-----------------------------------------------------------------------------
export async function sendMail(to,subject,html) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NEXT_PUBLIC_MAILER_ID,
          pass: process.env.NEXT_PUBLIC_MAILER_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.NEXT_PUBLIC_MAILER_ID,
        to,
        subject,
        html,
      };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw new Error(error);
    } else {
      return true;
    }
  });
}