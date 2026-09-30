import "dotenv/config";
import { connectedToDb } from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

import app from "./src/app.js";
connectedToDb();
testAi()
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})