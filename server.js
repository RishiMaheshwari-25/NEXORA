import "dotenv/config";
import { connectedToDb } from "./src/config/database.js";

import app from "./src/app.js";
connectedToDb();
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})