import User from "../models/User";
import bcrypt from "bcryptjs";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";

const router = express.Router();

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
	console.log("session id " + req.session);
	if (req.session) {
		next();
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

router.post("/register", async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const exists = await User.findOne({ username });
	if (exists) return res.status(400).json({ error: "UserName already exists" });

	const user = new User({ username, password });
	await user.save();
	res.json({ message: "User registered " });
});

router.get("/test", (req: Request, res: Response) => {
	const user = (req.session as any).user;
	console.log("user " + user);
	return res.json({ user: user });
});

router.get("/check", checkAuth, async (req: Request, res: Response) => {
	req.setTimeout(0);

	const sessionUser = (req.session as any).user;
	if (sessionUser) {
		return res.json({
			message: `The user is authenticated`,
			user: sessionUser,
			isAllow: true,
		});
	} else {
		return res.json({ message: "not authenticated", isAllow: false });
	}
});

router.post("/google/signin", async (req: Request, res: Response) => {
	const { tokenResponse } = req.body;
	console.log(tokenResponse);
	try {
		const response = await axios.get(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			{
				headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
			},
		);

		const { given_name, family_name, picture, email } = response.data;

		const user = await User.findOne({ email });
		if (user) {
			(req.session as any).user = { id: user._id, email: user.email };
			req.session.save();
			return res.json({
				message: "logged in old user",
				user: (req.session as any).user,
			});
		}

		const newUser = new User({
			firstName: given_name || "",
			lastName: family_name || "",
			email: email,
			picUrl: picture,
		});
		await newUser.save();
		(req.session as any).user = { id: newUser._id, email: newUser.email };

		return res.status(200).json({
			message: "logged in new user",
			user: (req.session as any).user,
		});
	} catch (err) {
		console.log("Server error " + err);
		return res.status(500).json({ error: "Server error" });
	}
});

// router.post("/login", async (req: Request, res: Response) => {
// 	const { username, password } = req.body;

// 	const user = await User.findOne({ username }, "username password").exec();
// 	if (!user)
// 		return res.status(400).json({ message: "Username does not exist" });

// 	const compare = await bcrypt.compare(password, user.password as string);
// 	if (!compare) return res.status(400).json({ message: "Invalid Password" });

// 	const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN as string, {
// 		expiresIn: "1h",
// 	});
// 	res.json({ message: "Logged In", token: token });
// });

router.get("/logout", checkAuth, (req: Request, res: Response) => {
	(req.session as any).user = null;
	req.session.save();
	return res.json({ message: "logout" });
});

export default router;
