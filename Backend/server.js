import "dotenv/config";
import { connectedToDb } from "./src/config/database.js";
import http from "http";
import app from "./src/app.js";
import {initSocket} from "./src/socket/server.socket.js";
// import { testAi } from "./src/services/ai.service.js";

const httpServer=http.createServer(app);
initSocket(httpServer);
connectedToDb();
// testAi()
httpServer.listen(3001,()=>{
    console.log("Server is running on port 3001");
})