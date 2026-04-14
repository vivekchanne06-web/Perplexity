import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import http from "http";
import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
// import { testAi } from "./src/services/ai.service.js";
import { initSocketServer } from "./src/sockets/server.socket.js";


dotenv.config();

const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

initSocketServer(httpServer);

    connectDB();
	// testAi();

	httpServer.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
