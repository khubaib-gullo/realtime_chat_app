import mongoose from "mongoose";
import { Model, ConvoSchemaType } from "./types.js";

const ConvoSchema = new mongoose.Schema<ConvoSchemaType>({
	between: [{ type: mongoose.Schema.Types.ObjectId, ref: Model.user }],
	// messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
	created_date: { type: Date, default: Date.now },
	last_message: {
		type: mongoose.Schema.Types.ObjectId,
		ref: Model.message,
	},
});

export default mongoose.model(Model.converstaion, ConvoSchema);

// import mongoose from "mongoose";

// const ConvoSchema = mongoose.Schema({
//     between: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     // messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
//     created_date: { type: Date, default: Date.now },
//     last_message: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Message",
//     },
// });

// export default mongoose.model("Conversation", ConvoSchema);
