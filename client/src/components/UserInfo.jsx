import React, { useState, useEffect } from "react";
import axios from "axios";
import base_url from "../export";

export default function UserInfo({
	convo_id,
	reciever_name,
	reciever_pic,
	messages,
}) {
	const [data, setData] = useState([]);
	// const [change, setChange]

	const get_media_url = async (convo_id) => {
		const response = await axios.get(
			`${base_url}/api/chatroom/get_media?convo_id=${convo_id}`,
			{
				withCredentials: true,
			},
		);
		// console.log("mediaaaaaaaaaaaaaa ", response.data.media);
		let data = response.data.media;
		setData(data.slice(0, 5));
	};

	useEffect(() => {
		get_media_url(convo_id);
	}, [messages]);
	return (
		<div className="text-white  ">
			<div className="flex flex-col  items-center border border-stone-900 bg-stone-900 mr-1 rounded-lg">
				<div>
					<img
						className="w-15 h-15 rounded-full m-3"
						src={reciever_pic}
						alt=""
					/>
				</div>
				<div>
					<h3>{reciever_name}</h3>
				</div>
			</div>
			<div className="flex flex-col ">
				<div className="flex flex-wrap  m-2 ">
					{data &&
						data.map((x) => (
							<img
								className="w-20 h-20 m-1 "
								key={x._id}
								src={x.media}
								alt=""
							/>
						))}

					{/* <img className="w-10 h-10 m-2 " src="./images/download.png" alt="" />
					<img className="w-10 h-10 m-2 " src="./images/download.png" alt="" />
					<img className="w-10 h-10 m-2 " src="./images/download.png" alt="" />
					<img className="w-10 h-10 m-2 " src="./images/download.png" alt="" />
					<img className="w-10 h-10 m-2 " src="./images/download.png" alt="" /> */}
				</div>
				<div>
					<button className="text-[10px]  rounded-full p-1 underline  transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
						open
					</button>
				</div>
			</div>
		</div>
	);
}
