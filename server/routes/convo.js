import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

const convoRouter = express.Router();

const checkAuth = async (req, res, next) => {
	// req.session;
	// console.log("session id " + req.session);
	if (req.session) {
		next();
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

convoRouter.post("/send_message", checkAuth, async (req, res) => {
	const { sender_id, convo_id } = req.body;
	try {
		// const user = req.session.email;

		// const sender = await User.findOne({ email: user });
		const message = await Message.create({
			convo: "68adffa4fbb5c0bc4294af6c",
			sender: sender_id,
			text: "heloo heloo helllo  ",
		});
		message.save();

		const convo = await Conversation.findOneAndUpdate(
			{ _id: convo_id },
			{ $set: { last_message: message._id } },
			{ new: true }
		);
		console.log(convo);

		if (convo) {
			res.status(200).json({ message: message, convo: convo });
		}
	} catch (err) {
		res.json({ error: err });
	}
});

convoRouter.get("/list_conversation", checkAuth, async (req, res) => {
	const { email } = req.session.user;
	// const { user } = req.body;
	try {
		const sender = await User.findOne({ email: email });

		// console.log(sender);

		const all_convo = await Conversation.find({
			between: { $all: [sender._id] },
		})
			.populate({
				path: "between",
				select: "email firstName lastName picUrl",
			})
			.populate({
				path: "last_message",
				select: "text date",
			})
			.sort({ "last_message.date": -1 });

		const newlist = all_convo.map((li) => {
			let reciever;
			// console.log(li.last_message);
			// console.log(li.between);
			// const reciever = li.between
			// console.log("between " + li.between);
			if (li.between[0].email === sender.email) {
				reciever = li.between[1];
				// console.log("this line x " + reciever);
			} else {
				reciever = li.between[0];
				// console.log("this line Y " + reciever);
			}

			// console.log("reciever_id " + reciever);
			// const reciever = User.findOne({ id: reciever_id });

			return {
				last_message: li.last_message,
				sender: sender,
				reciever: reciever,
				convo_id: li._id,
			};
		});

		// console.log("new list " + JSON.stringify(newlist));

		return res.status(200).json({
			all_conversations: newlist,
		});
	} catch (err) {
		res.status(500).json({ error: err });
	}
});

convoRouter.post("/start_search_convo", checkAuth, async (req, res) => {
	try {
		const { reciever_id } = req.body;
		const { id } = req.session.user;

		const old_convo = await Conversation.findOne({
			between: { $all: [id, reciever_id] },
		}).populate("between", "email");
		if (old_convo) {
			// console.log("old convooooooo ", old_convo);
			return res.status(200).json({ convo: old_convo, status: "ok" });
		}
		const convo = await Conversation.create({ between: [id, reciever_id] });
		const message = await Message.create({
			sender: id,
			convo: convo._id,
			text: "hi",
			media: "",
		});
		convo.last_message = message._id;
		convo.save();

		// console.log("new convooooooo ", convo);

		return res.status(200).json({ convo: convo, status: "ok" });
	} catch (err) {
		res.status(500).json({ error: err, status: "error" });
	}
});

convoRouter.get("/search_user", checkAuth, async (req, res) => {
	const { search } = req.query;
	const { email } = req.session.user;

	const user = await User.findOne({ email: search });
	// console.log("email user emailllllllll ", user, email);
	if (user) {
		if (user.email != email)
			// console.log(user);
			return res.json({ status: "ok", user: user });
	} else {
		console.log("not found");

		return res.json({
			status: "Not Found",
			user: {
				_id: null,
				firstName: "not",
				lastName: "found",
				email: " ",
				picUrl:
					"https://media.istockphoto.com/id/1500807425/vector/image-not-found-icon-vector-design.jpg?s=1024x1024&w=is&k=20&c=h3cQFxpWy6M93hzbRb4dqJyhsV_kVps9R7Rj2PaH4xE=",
			},
		});
	}
});

convoRouter.get("/list_messages", checkAuth, async (req, res) => {
	const { convo_id, page_count } = req.query;
	try {
		// console.log(JSON.stringify(user, consumer));
		let page = parseInt(page_count);
		let pageSize = 10;

		// new query
		const totalCount = await Message.countDocuments({ convo: convo_id });

		// paginated messages
		const messages = await Message.find({ convo: convo_id })
			.limit(pageSize)
			.sort({ createdAt: -1 }) // newest first
			.skip((page - 1) * pageSize)
			.populate("sender", "firstName lastName email")
			.exec();

		return res.status(200).json({
			success: true,
			messages: {
				metadata: { totalCount: totalCount, page, pageSize },
				data: messages,
			},
		});
	} catch (err) {
		res.status(500).json({ message: false });
	}
});

convoRouter.get("/get_media", checkAuth, async (req, res) => {
	const { convo_id, page_count } = req.query;
	let page = parseInt("1");
	let pageSize = 10;
	try {
		const media = await Message.find({ convo: convo_id, media: { $ne: "" } })
			.limit(pageSize)
			.sort({ createdAt: -1 })
			.skip((page - 1) * pageSize)
			.populate("sender", "firstName lastName email")
			.exec();

		res.status(200).json({ media: media });
	} catch (err) {
		res.status(500).json({ error: err });
	}
});
convoRouter.post("/upload_image", checkAuth, async (req, res) => {
	(async function () {
		// Configuration
		cloudinary.config({
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
		});

		// Upload an image
		const uploadResult = await cloudinary.uploader
			.upload(
				"https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
				{
					public_id: "shoes",
				}
			)
			.catch((error) => {
				console.log(error);
			});

		// console.log(uploadResult);

		// Optimize delivery by resizing and applying auto-format and auto-quality
		const optimizeUrl = cloudinary.url("shoes", {
			fetch_format: "auto",
			quality: "auto",
		});

		// console.log(optimizeUrl);

		// Transform the image: auto-crop to square aspect_ratio
		const autoCropUrl = cloudinary.url("shoes", {
			crop: "auto",
			gravity: "auto",
			width: 500,
			height: 500,
		});

		// console.log(autoCropUrl);
	})();
	res.status(200).json("ok");
});
export default convoRouter;
