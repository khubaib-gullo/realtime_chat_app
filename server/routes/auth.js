import User from "../models/User.js";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

const router = express.Router();

const checkAuth = async (req, res, next) => {
	// req.session;
	console.log("session id " + req.session);
	if (req.session) {
		next();
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

router.post("/register", async (req, res) => {
	const { username, password } = req.body;
	const exists = await User.findOne({ username });
	if (exists) return res.status(400).json({ error: "UserName already exists" });

	const user = new User({ username, password });
	await user.save();
	res.json({ message: "User registered " });
});

router.get("/test", function (req, res) {
	const user = req.session.user;
	console.log("user " + user);
	return res.json({ user: user });
});

router.get("/check", checkAuth, async (req, res) => {
	req.setTimeout(0); // no timeout

	await req.session.user;
	// console.log(req.session.user);
	if (req.session.user) {
		return res.json({
			message: `The user is authenticated `,
			user: req.session.user,
			isAllow: true,
		});
	} else {
		return res.json({ message: "not autheticated ", isAllow: false });
	}
});

router.post("/google/signin", async (req, res) => {
	const { tokenResponse } = req.body;
	console.log(tokenResponse);
	try {
		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
			}
		);

		const { given_name, family_name, picture, email } = response.data;
		// console.log(response.data);

		const user = await User.findOne({ email });
		if (user) {
			req.session.user = { id: user._id, email: user.email };
			req.session.save();
			return res.json({
				message: "loged in old user ",
				user: req.session.user,
			});
		}

		const newUser = new User({
			firstName: given_name || "",
			lastName: family_name || "",
			email: email,
			picUrl: picture,
		});
		newUser.save();
		req.session.user = { id: newUser._id, email: newUser.email };

		return res
			.status(200)
			.json({ message: "loged In New User ", user: req.session.user });
	} catch (err) {
		console.log("Serever error " + err);
	}
});

router.post("/login", async (req, res) => {
	const { username, password } = req.body;
	// console.log("4$$$$$$$$$$$$$$$$$$$$$" + username, password);
	const user = await User.findOne({ username }, "username password").exec();

	// console.log("user find " + user);
	if (!user) res.status(400).json({ message: " Username does not exist" });
	const compare = await bcrypt.compare(password, user.password);

	if (!compare) res.status(400).json({ message: "Invalid Password" });

	const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, {
		expiresIn: "1h",
	});
	res.json({ message: "Logged In ", token: token });
});

router.get("/logout", checkAuth, (req, res) => {
	req.session.user = null;
	req.session.save();
	return res.json({ message: "logout " });
});

export default router;
