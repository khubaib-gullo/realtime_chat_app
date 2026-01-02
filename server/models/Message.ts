// import mongoose from "mongoose";

// const messageSchema = mongoose.Schema({
// 	sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
// 	text: { type: String },
// 	createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model("Message", messageSchema);

import mongoose from "mongoose";
import { Model, MessageType } from "./types.js";

const messageSchema = new mongoose.Schema<MessageType>(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, ref: Model.user },
		convo: { type: mongoose.Schema.Types.ObjectId, ref: Model.converstaion },
		text: { type: String },
		date: { type: Date, default: Date.now },
		media: { type: String, default: "" },
	},
	{ timestamps: true }
);

export default mongoose.model(Model.message, messageSchema);
