import React, { useState, useEffect, useRef } from "react";

import SearchBar from "./SearchBar";
import MessageBox from "./MessageBox";
import axios from "axios";
import UserInfo from "./UserInfo";
import StartChat from "./StartChat";
import Convo from "./Convo";
import LinearProgress from "@mui/material/LinearProgress";
import { io } from "socket.io-client";
import base_url from "../export";

export default function MsgArea(props) {
	// const base_url = base_url;
	const [messages, setMessages] = useState([]);
	const [messageInput, setMessageInput] = useState("");
	const [socket, setSocket] = useState(null);
	const date = new Date().toLocaleTimeString();
	const [showBar, setShowBar] = useState(false);
	const [show, setShow] = useState(false);
	const [data, setData] = useState([]);
	const [reciever_id, setRecieverId] = useState("");
	const [sender_id, setSenderId] = useState("");
	const [inMessage, setInMessage] = useState([]);
	const [recieverName, setRecieverName] = useState("");
	const [reciever_Pic_url, setRecieverPicUrl] = useState("");
	const [scroll, setScroll] = useState(0);
	const [convoId, setConvoId] = useState("");
	const [pageCount, setPageCount] = useState(1);
	const scroolRef = useRef(null);
	const [displayImage, setDisplayImage] = useState("");
	const [file, setFile] = useState(null);
	const [query, setQuery] = useState("");
	const [searchUser, setSearchUser] = useState("");

	const getMessages = async (convo_id, pageCount) => {
		console.log("convo id and page count ", convo_id, pageCount);
		try {
			setShowBar(true);

			const response = await axios.get(
				`${base_url}/api/chatroom/list_messages?convo_id=${convo_id}&page_count=${pageCount}`,
				{
					withCredentials: true,
				},
			);
			// console.log("response for message area " + JSON.stringify(response.data));
			var { data } = response.data.messages;
			var newData = data.reverse(); // 321 654 789 987
			// console.log("response for  message " + JSON.stringify(newData));

			setMessages((prev) => {
				let prev_data = prev.map((x) => x._id);
				let set = new Set(prev_data);
				let nd = newData.filter((x) => !set.has(x._id));
				if (nd.length == 1) {
					return [...prev, ...nd];
				}

				// console.log("new messagesssssssssss ", nd);
				// console.log("old messagessssssss ", set);
				// prev 321 new 456 new 987 321 456 987  321  [987 654 321 ]
				return [...nd, ...prev];
			});
			setShowBar(false);
		} catch (err) {
			console.log("error in message area " + err);
		}
	};

	useEffect(() => {
		const socket = io(base_url, {
			withCredentials: true,
		});

		socket.on("connect", () => {
			console.log("user connected");
		});

		socket.on("disconnect", () => {
			console.log("server dissconnected ");
		});

		socket.on("receive_message", ({ convo_id }) => {
			getMessages(convo_id, pageCount);

			// setMessages([]);
			// setPageCount(() => {
			// 	return 1;
			// });
		});
		setSocket(socket);

		return () => socket.disconnect();
	}, []);

	const scrollToBottom = () => {
		console.log("surrent reference scrolll ", scroolRef);
		if (scroolRef.current) {
			scroolRef.current.scrollTop = scroolRef.current.scrollHeight;
		}
	};

	const sendMessage = async () => {
		if (messageInput && socket) {
			socket.emit("send_message", {
				text: messageInput,
				sender_id: sender_id,
				reciever_id: reciever_id,
				convo_id: convoId,
				file: file,
			});
			setMessageInput("");
			setFile();
			console.log("message sent ");
			scrollToBottom();
		}
	};

	const onSearchChange = (event) => {
		setQuery(event.target.value);

		// console.log(event.target.value);
	};

	const onKeyEnter = (event) => {
		if (event.key === "Enter") {
			console.log("enterrrrrrrrr ", query);
		}
	};

	const handelChange = async (sender, reciever, convo_id) => {
		// console.log("hello from left bar " + JSON.stringify(sender));
		// console.log("hello from left bar " + JSON.stringify(reciever));
		setSenderId(sender._id);
		setRecieverId(reciever._id);
		setRecieverName(reciever.firstName + " " + reciever.lastName);
		setRecieverPicUrl(reciever.picUrl);
		setConvoId((prev) => {
			// console.log("new convo id idddddd ", convo_id);
			// console.log("prev convo id convo id idddddd ", prev);
			if (convo_id !== prev) {
				setMessages(() => {
					setPageCount(1);
					return [];
				});
			}
			return convo_id;
		});

		// console.log("messagesssssssssss ", messages);

		// console.log(
		// 	"datttttt ",
		// 	convo_id,
		// 	reciever._id,
		// 	sender._id,
		// 	reciever.firstName + " " + reciever.lastName,
		// 	pageCount
		// );

		scrollToBottom();
		setShow(true);
	};

	const getData = async () => {
		try {
			const response = await axios.get(
				`${base_url}/api/chatroom/list_conversation`,
				{ withCredentials: true },
			);
			const { all_conversations } = response.data;
			// console.log("all_conversations " + JSON.stringify(all_conversations));
			let ac = all_conversations.reverse();
			setData(() => [...ac]);
		} catch (err) {
			console.log("err " + err);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (convoId) {
			getMessages(convoId, pageCount);
		}
	}, [convoId, pageCount]);

	// searching for user
	useEffect(() => {
		const delay = setTimeout(() => {
			console.log("queryyyyyyy ", query);
			search_user(query);
		}, 1000);
		return () => clearTimeout(delay);
	}, [query]);

	const handleScroll = (event) => {
		// Access scroll properties from event.currentTarget
		const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
		// console.log("Scrollllll ", scrollTop, scrollHeight, clientHeight);
		if (scrollTop === 0) {
			setPageCount((prev) => {
				// getMessages(convoId, prev + 1);
				return prev + 1;
			});
		}
	};

	const handelFile = (event) => {
		setFile(event.target.files[0]);
	};

	const search_user = async (q) => {
		try {
			const response = await axios.get(
				`${base_url}/api/chatroom/search_user/?search=${q}`,
				{ withCredentials: true },
			);
			const { status, user } = response.data;
			setSearchUser(user);
		} catch (err) {
			console.log("error in statring new convo ");
		}
	};

	const addConversation = async (id) => {
		if (id) {
			console.log("idddddd ", id);
			try {
				const response = await axios.post(
					`${base_url}/api/chatroom/start_search_convo`,
					{ reciever_id: id },
					{ withCredentials: true },
				);
				let { status } = response.data;
				if (status === "ok") {
					setSearchUser("");
					setQuery("");
					getData();
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="grid grid-cols-10  h-100 ">
			<div className="col-span-3   h-auto  m-0.5 border-r border-stone-900">
				<SearchBar
					onkeydown={onKeyEnter}
					onchange={onSearchChange}
					value={query}
				/>

				{query != "" && (
					<div>
						<Convo
							profile_pic={searchUser.picUrl}
							firstName={searchUser.firstName + " " + searchUser.lastName}
							click={() => addConversation(searchUser._id)}
							// lastName={item.reciever.lastName}
						/>
						<input />
					</div>
				)}

				{!query &&
					data.map((item) => (
						<Convo
							key={item.convo_id}
							profile_pic={item.reciever.picUrl}
							text={item.last_message.text}
							time={item.last_message.date}
							firstName={item.reciever.firstName + " " + item.reciever.lastName}
							// lastName={item.reciever.lastName}
							click={() =>
								handelChange(item.sender, item.reciever, item.convo_id)
							}
						/>
					))}
			</div>
			<>
				{show ? (
					<div className=" col-span-7   h-auto relative m-0.5   pr-1 border-r border-stone-900">
						<div className="grid grid-cols-7">
							<div className="col-span-5">
								<div className="flex flex-col h-[550px]">
									<div className="flex flex-row justify-between  p-1 rounded-lg border-0 bg-stone-900 mb-3">
										<div className="flex flex-grow items-center">
											<img
												className="w-10 h-10 rounded-full mr-2"
												src={reciever_Pic_url}
												alt=""
											/>
											<div>
												<h4 className="text-white">{recieverName}</h4>
											</div>
										</div>
										<SearchBar />
									</div>

									{showBar && (
										<LinearProgress
											sx={{
												backgroundColor: "lightgrey",
												".MuiLinearProgress-bar": {
													backgroundColor: "grey",
												},
											}}
										/>
									)}

									<div
										className="overflow-auto h-[77%] "
										onScroll={handleScroll}
										ref={scroolRef}
									>
										{messages.map((item) => (
											<MessageBox
												key={item._id}
												text={item.text}
												date={item.date}
												media={item.media}
												isSender={item.sender._id === sender_id ? true : false}
											/>
										))}
									</div>

									<div className="absolute    bottom-0 w-[70%]  text-white bg-stone-900 flex p-1 rounded-lg">
										{displayImage && (
											<img
												className="w-15 h-15 rounded-full m-3"
												src={displayImage}
												alt=""
											/>
										)}
										<div>
											<label className="flex items-center gap-2 cursor-pointer  rounded-xl p-3 hover:bg-stone-800">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth="1.5"
													stroke="currentColor"
													className="size-6"
													margin="2px"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
													/>
												</svg>
												<input
													type="file"
													className="hidden"
													onChange={handelFile}
												/>
											</label>
										</div>
										<button className="transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"></button>
										<textarea
											className="  w-full placeholder: text-[12px] m-2 outline-0  resize-none "
											type="text"
											value={messageInput}
											onKeyDown={(event) => {
												if (event.key == "Enter") {
													event.preventDefault();
													return sendMessage();
												}
											}}
											onChange={(e) => setMessageInput(e.target.value)}
											placeholder="Type message... "
										/>

										<button
											className=" transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
											onClick={sendMessage}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className="size-6"
												margin="5px"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
							<div className="col-span-2 ml-1 border-l border-stone-900 pl-2">
								<UserInfo
									convo_id={convoId}
									reciever_name={recieverName}
									reciever_pic={reciever_Pic_url}
									messages={messages}
								/>
							</div>
						</div>
					</div>
				) : (
					<StartChat />
				)}
			</>
		</div>
	);
}
