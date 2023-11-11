import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT46

connectDB()

app.listen(port, ()=>{
    console.log("DB Online");
})


