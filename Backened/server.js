
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

const allowedOrigins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin:function(origin,callback){
        if(!origin||allowedOrigins.includes(origin)){
            return callback(null,true);
        }
        return callback(new Error("Not allowed by CORS"));
    }
}));

app.use(express.json({limit:"10kb"}));

const registrationLimit=rateLimit({
    windowMs:15*60*1000,
    max:10,
    message:{
        success:false,
        message:"Too many registration attempts. Please try again later."
    }
});

// Home route
app.get("/",(req,res)=>{
    res.status(200).send("EventHub Registration Server is Running!");
});

// Health check
app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Registration server is running!"
    });
});

// Registration API
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

        console.error("REGISTRATION ERROR:",error);

        return res.status(500).json({
            success:false,
            message:"Something went wrong. Please try again."
        });
    }
});

// Invalid route
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:"Route not found"
    });
});

// Server start
const PORT=process.env.PORT||5000;

const startServer=async()=>{
    try{
        await connectDB();
        await Registration.init();

        console.log("Registration Model Indexes Ready");

        app.listen(PORT,"0.0.0.0",()=>{
            console.log(`Server running on port ${PORT}`);
        });

    }catch(error){
        console.error("SERVER ERROR:",error);
        process.exit(1);
    }
};

startServer();
