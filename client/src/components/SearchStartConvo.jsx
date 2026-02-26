import React, { use, useState } from "react";
import axios from "axios";
import base_url from "../export";

export default function SearchStartConvo({ query }) {
	const start_new_convo = async (q) => {
		try {
			const response = await axios.get(
				`${base_url}/api/chatroom/search_user/?search=${q}`,
				{ withCredentials: true },
			);
			const { status } = response.data;
			return status;
		} catch (err) {
			console.log("error in statring new convo ");
		}
	};

	if (query === "") {
		return null;
	}
	let query_data = start_new_convo(query);
	const data = use(query_data);

	return (
		<div className="text-white absolute h-20 w-50 rounded-md  bg-stone-700">
			{data}
			<br />
		</div>
	);
}
