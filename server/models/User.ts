// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// // const userSchema = new mongoose.Schema({
// // 	username: { type: String, unique: true, required: true },
// // 	password: { type: String, required: true },
// // });

// const userSchema = mongoose.Schema({
// 	username: { type: String, required: true, unique: true },
// 	password: { type: String, required: true },
// });

// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();
// 	this.password = await bcrypt.hash(this.password, 10);
// 	next();
// });

// export default mongoose.model("User", userSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Model, userSchemaType } from "./types.js";

const userSchema = new mongoose.Schema<userSchemaType>({
	firstName: { type: String, required: true },
	lastName: { type: String },
	email: { type: String, required: true, unique: true },
	picUrl: { type: String },
});

// userSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();
// 	this.password = await bcrypt.hash(this.password, 10);
// 	next();
// });

export default mongoose.model(Model.user, userSchema);
