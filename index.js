const {instrument} = require("@socket.io/admin-ui");
const app = require('express')();
const cors  = require("cors");
app.use(cors());
const server = require('http').createServer(app);
// const {Server} = require("socket.io")

const port = process.env.PORT || 3001


const io = require("socket.io")(server,{
    cors:{
        origin:"https://phenomenal-mandazi-8beb83.netlify.app",
        // origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
})

let counterConnection = 0;  
io.on('connection', (socket) => {
    counterConnection++;
    io.emit("user_count", counterConnection);

    socket.on("join_room", (room)=>{
        socket.join(room)
        console.log(`User with ID: ${socket.id} joined room: ${room}`);

    });

    socket.on("send_message", (data) => {
        console.log(`User ${data.author} sent the message ${JSON.stringify(data)}`);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        counterConnection--;
        io.emit("user_count", counterConnection);
    });
});

server.listen(port, ()=>console.log(`Server starting on port ${port}`));

instrument(io, { auth: false });