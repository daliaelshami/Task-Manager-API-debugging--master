require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(express.json());




// Bug:methods are written using .then() and .catch() 
// Fix: change to async/await and return the promise to ensure proper error handling and response sending
// DB connection 
async function connectionDB(){
    try{
        await mongoose.connect("mongodb://localhost:27017/taskmanager")
        console.log('connected');
    }catch(error){
        console.log(error);
    }
}
connectionDB();

app.use("/api", taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
