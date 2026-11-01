
const dns=require("dns");
dns.setServers(["8.8.8.8","8.8.4.4"]);

const express=require("express");
const helmet=require("helmet");
const cors=require("cors");
const crypto=require("crypto");
const QRCode=require("qrcode");
const {rateLimit}=require("express-rate-limit");

require("dotenv").config();

const connectDB=require("./database");
const Registration=require("./Registration");
const validateRegistration=require("./validation");
const sendEmail=require("./email");

const app=express();

app.use(helmet());

app.use(cors({
    origin:function(origin,callback){
        if(!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)){
            callback(null,true);
        }else{
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.json({limit:"10kb"}));

const registrationLimit=rateLimit({
    windowMs:15*60*1000,
    max:10
});

app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Registration server is running!"
    });
});

app.post("/api/registrations",registrationLimit,async(req,res)=>{
    try{
        const result=validateRegistration(req.body);

        if(!result.valid){
            return res.status(400).json({
                success:false,
                message:"Invalid form details",
                errors:result.errors
            });
        }

        const ticketId="REG-"+crypto.randomBytes(8).toString("hex").toUpperCase();

        const qrBuffer=await QRCode.toBuffer(ticketId);

        const registration=new Registration({
            ...result.data,
            ticketId,
            emailStatus:"pending"
        });

        await registration.save();

        try{
            await sendEmail(result.data.email,ticketId,qrBuffer);

            registration.emailStatus="sent";
            await registration.save();

            console.log("Registration email sent successfully");

            return res.status(201).json({
                success:true,
                message:"Registration successful!",
                ticketId,
                emailStatus:"sent"
            });

        }catch(emailError){
            console.error("EMAIL ERROR:",emailError.message);

            registration.emailStatus="failed";
            await registration.save();

            return res.status(201).json({
                success:true,
                message:"Registration saved, but QR email could not be sent.",
                ticketId,
                emailStatus:"failed"
            });
        }

    }catch(error){
        if(error.code===11000){
            const field=Object.keys(error.keyPattern||{})[0];

            const messages={
                email:"Email already registered",
                studentNumber:"Student number already registered",
                universityRollNumber:"University roll number already registered"
            };

            return res.status(409).json({
                success:false,
                message:messages[field]||"Duplicate registration"
            });
        }

        console.error("REGISTRATION ERROR:",error.message);

        return res.status(500).json({
            success:false,
            message:"Something went wrong. Please try again."
        });
    }
});

const PORT=process.env.PORT||5000;

const startServer=async()=>{
    try{
        await connectDB();
        await Registration.init();

        console.log("Registration Model Indexes Ready");

        app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`);
        });

    }catch(error){
        console.error("SERVER ERROR:",error.message);
        process.exit(1);
    }
};

startServer();
