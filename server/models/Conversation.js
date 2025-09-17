import mongoose from "mongoose";

const ConvoSchema = mongoose.Schema({
	between: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	// messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	created_date: { type: Date, default: Date.now },
	last_message: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Message",
	},
});

export default mongoose.model("Conversation", ConvoSchema);
