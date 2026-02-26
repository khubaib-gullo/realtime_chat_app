// import { DB } from "./config/db.js";
// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import authRouter from "./routes/auth.js";
// import dotenv from "dotenv";
// import cors from "cors";
// import session from "express-session";
// import MongoStore from "connect-mongo";
// import convoRouter from "./routes/convo.js";
// import sharedsession from "express-socket.io-session";
// import Conversation from "./models/Conversation.js";
// import User from "./models/User.js";
// import Message from "./models/Message.js";
// import axios from "axios";

// import connect_to_cloudinary, {
// 	uploadResult,
// } from "../server/cloudinary/cloudinary_config.js";

// dotenv.config();
// const app = express();
// const server = createServer(app);

// //connect to cloudinary
// connect_to_cloudinary();

// const create_session = session({
// 	secret: "keyboard cat",
// 	resave: false,
// 	saveUninitialized: true,
// 	store: MongoStore.create({
// 		mongoUrl: process.env.MONOGO_URI,
// 		// Optional: set a TTL for sessions (e.g., 14 days)
// 		ttl: 14 * 24 * 60 * 60,
// 	}),
// 	cookie: { secure: false },
// });

// const token = "ewfe";

// const io = new Server(server, {
// 	cors: {
// 		origin: ["http://localhost"], //or whatever port your frontend is using
// 		credentials: true,
// 		methods: ["GET", "POST"],
// 	},
// });

// const corsOrigin = {
// 	origin: ["http://localhost"], //or whatever port your frontend is using
// 	credentials: true,
// 	methods: ["GET", "POST"],
// };

// app.use(cors(corsOrigin));
// app.use(express.json());

// app.use(create_session);
// io.use(
// 	sharedsession(create_session, {
// 		autoSave: true,
// 	}),
// );

// app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRouter);
// app.use("/api/chatroom", convoRouter);

// app.use("/api/status", (req, res) => {
// 	return res.json({ status: "server is live" });
// });

// io.on("connection", (socket) => {
// 	console.log(
// 		"socket session connected " + JSON.stringify(socket.handshake.session.user),
// 	);

// 	socket.on("send_message", async (message_data) => {
// 		console.log("message recieved ", message_data);
// 		// const image = new Blob([message_data.file], {
// 		// 	type: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
// 		// });
// 		// const imageUrl = URL.createObjectURL(image);
// 		let url = "";
// 		if (message_data.file != null) {
// 			url = await uploadResult(message_data.file);
// 		}

// 		const message = await Message.create({
// 			convo: message_data.convo_id,
// 			sender: message_data.sender_id,
// 			text: message_data.text,
// 			media: url,
// 		});
// 		await message.save();
// 		const convo = await Conversation.findOneAndUpdate(
// 			{ _id: message_data.convo_id },
// 			{ $set: { last_message: message._id } },
// 			{ new: true },
// 		);
// 		if (convo) {
// 			await convo.save();
// 			console.log("message sent in prev convo ", message);
// 			console.log(" prev convo  ", convo);
// 		}

// 		io.emit("receive_message", {
// 			convo_id: convo._id,
// 		});

// 		socket.on("disconnect", () => {
// 			console.log("user disconnected ");
// 		});
// 	});
// });
// await DB();
// server.listen(process.env.PORT, () =>
// 	console.log("server running on port http://localhost:4000"),
// );

import { DB } from "./config/db";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import convoRouter from "./routes/convo";
import sharedsession from "express-socket.io-session";
import Conversation from "./models/Conversation";
import User from "./models/User";
import Message from "./models/Message";
import axios from "axios";
import connect_to_cloudinary, {
	uploadResult,
} from "./cloudinary/cloudinary_config";

dotenv.config();
const app = express();
const server = createServer(app);

// connect to cloudinary
connect_to_cloudinary();

const create_session = session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({
		mongoUrl: process.env.MONOGO_URI as string,
		ttl: 14 * 24 * 60 * 60,
	}),
	cookie: { secure: false },
});

const io = new Server(server, {
	cors: {
		origin: ["http://localhost"],
		credentials: true,
		methods: ["GET", "POST"],
	},
});

const corsOrigin = {
	origin: ["http://localhost"],
	credentials: true,
	methods: ["GET", "POST"],
};

app.use(cors(corsOrigin));
app.use(express.json());
app.use((req, res, next) => {
	// ✅ add here
	res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
	next();
});
app.use(create_session);

io.use(
	sharedsession(create_session, {
		autoSave: true,
	}),
);

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/chatroom", convoRouter);

app.use("/api/status", (req: Request, res: Response) => {
	return res.json({ status: "server is live" });
});

interface MessageData {
	convo_id: string;
	sender_id: string;
	text: string;
	file: string | null;
}

io.on("connection", (socket: Socket) => {
	console.log(
		"socket session connected " +
			JSON.stringify((socket.handshake as any).session?.user),
	);

	socket.on("send_message", async (message_data: MessageData) => {
		console.log("message recieved ", message_data);

		let url = "";
		if (message_data.file != null) {
			url = await uploadResult(message_data.file);
		}

		const message = await Message.create({
			convo: message_data.convo_id,
			sender: message_data.sender_id,
			text: message_data.text,
			media: url,
		});
		await message.save();

		const convo = await Conversation.findOneAndUpdate(
			{ _id: message_data.convo_id },
			{ $set: { last_message: message._id } },
			{ new: true },
		);

		if (convo) {
			await convo.save();
			console.log("message sent in prev convo ", message);
			console.log("prev convo ", convo);
		}

		io.emit("receive_message", {
			convo_id: convo?._id,
		});

		socket.on("disconnect", () => {
			console.log("user disconnected ");
		});
	});
});

// await DB();
// server.listen(process.env.PORT, () =>
// 	console.log("server running on port http://localhost:4000"),
// );

async function main() {
	await DB();
	server.listen(process.env.PORT, () =>
		console.log("server running on port http://localhost:4000"),
	);
}

main();
