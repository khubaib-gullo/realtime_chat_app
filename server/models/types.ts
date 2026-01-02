import mongoose from "mongoose";

enum Model {
	user = "User",
	message = "Message",
	converstaion = "Conversation",
}

interface ConvoSchemaType {
	between: mongoose.Types.ObjectId[];
	created_date: Date;
	last_message: mongoose.Types.ObjectId;
}

interface MessageType {
	sender: mongoose.Types.ObjectId;
	convo: mongoose.Types.ObjectId;
	text: String;
	date: Date;
	media: String;
}

// const userSchema = mongoose.Schema({
//     firstName: { type: String, required: true },
//     lastName: { type: String },
//     email: { type: String, required: true, unique: true },
//     picUrl: { type: String },
// });

interface userSchemaType {
	firstName: String;
	lastName: String;
	email: String;
	picUrl: String;
}

export { Model, ConvoSchemaType, MessageType, userSchemaType };
