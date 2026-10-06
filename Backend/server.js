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
const port=process.env.PORT || 3001;
httpServer.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})