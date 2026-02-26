import React from "react";
import { useNavigate } from "react-router";

import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import useStore from "../hooks/authCheck";
import base_url from "../export";

export default function Logout() {
	const navigate = useNavigate();
	const lo = useStore((state) => state.logout);

	const logout = async () => {
		const response = await axios.get(`${base_url}/api/auth/logout`, {
			withCredentials: true,
		});

		console.log(response.data);
		lo();

		// googleLogout();
		// alert("log out");
		navigate("/");
	};
	return (
		<div className="text-white h-[600px] justify-center flex text-center items-center">
			<div>
				<button
					onClick={logout}
					className=" bg-white m-2 p-2 rounded-full text-black text-lg w-12 hover:bg-stone-700"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path d="M500 261.8C500 403.3 403.1 504 260 504 122.8 504 12 393.2 12 256S122.8 8 260 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9c-88.3-85.2-252.5-21.2-252.5 118.2 0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9l-140.8 0 0-85.3 236.1 0c2.3 12.7 3.9 24.9 3.9 41.4z" />
					</svg>
				</button>
				<h3>Logout </h3>
			</div>
		</div>
	);
}
