
const nodemailer=require("nodemailer");

const sendEmail=async(email,ticketId,qrBuffer)=>{
    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });

    await transporter.verify();

    const info=await transporter.sendMail({
        from: `"Registration Team" <${process.env.EMAIL_USER}>`,
        to:email,
        subject:"Registration Successful | Your Entry Pass",
        text:`Dear Participant,

Congratulations! Your registration has been successfully completed.

Your Ticket ID: ${ticketId}

Please keep your QR code safe and present it at the time of entry.

We look forward to your participation.

Best Regards,
Registration Team`,
        html:`
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333;line-height:1.6;">
            <h2 style="color:#16803c;">Registration Successful!</h2>

            <p>Dear Participant,</p>

            <p>Congratulations! Your registration has been successfully completed.</p>

            <p><b>Your Registration Details:</b></p>

            <p><b>Ticket ID:</b> ${ticketId}</p>

            <p>Your entry QR code is provided below:</p>

            <div style="text-align:center;padding:15px;">
                <img src="cid:registrationqr" alt="Registration QR Code"
                style="width:220px;height:220px;">
            </div>

            <p>Please keep this QR code safe and present it at the time of entry.</p>

            <p>We look forward to your participation.</p>

            <p>Best Regards,<br><b>Registration Team</b></p>
        </div>
        `,
        attachments:[
            {
                filename:"Registration-QR.png",
                content:qrBuffer,
                contentType:"image/png",
                cid:"registrationqr"
            }
        ]
    });

    console.log("Email sent:",info.messageId);
    return info;
};

module.exports=sendEmail;
