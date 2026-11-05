
const express=require("express");
const app=express();
const path=require("path");

const http=require("http");//socketio runs on http server

const socketio=require("socket.io");
const server=http.createServer(app);

const io=socketio(server);

app.set("view engine","ejs");//ejs setup 
app.use(express.static(path.join(__dirname,"public")));//public setup ke liye

io.on("connection",function(socket){
    console.log("connected",socket.id);

    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id,latitude:data.latitude,longitude:data.longitude}); 
        
    });

    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id); 
    }); 
}); 


app.get("/",function (req,res){
    res.render("index");

});

server.listen(3000);
