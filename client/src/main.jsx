import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Home from "./pages/Home.jsx";
import Logout from "./pages/Logout.jsx";
import ProtectedRoutes from "../src/controlers/protected.jsx";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("client id ".client_id);

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<GoogleOAuthProvider clientId={client_id}>
		<Router>
			<Header />

			<Routes>
				<Route path="/" element={<Home />} />

				<Route path="/login" element={<Login />} />

				<Route element={<ProtectedRoutes />}>
					<Route path="/app" element={<App />} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/logout" element={<Logout />} />
				</Route>
			</Routes>
		</Router>
	</GoogleOAuthProvider>
	// </StrictMode>
);

// <Link to="/">
// 							<MenuItem onClick={handleClose}>Profile</MenuItem>
// 						</Link>
// 						<Link to="/profile">
// 							<MenuItem onClick={handleClose}>My account</MenuItem>
// 						</Link>
// 						<Link to="/login">
// 							<MenuItem onClick={handleClose}>Logout</MenuItem>
// 						</Link>

{
	/* <Routes>
						<Route path="/" element={<Profile />} />
						<Route path="/login" element={<Login />} />
						<Route path="/profile" element={<SignUp />} />
					</Routes> */
}
