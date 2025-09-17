import React from "react";
import Time from "./Time";

export default function Convo({ text, time, firstName, profile_pic, click }) {
	const date = new Date().toLocaleTimeString();

	return (
		<div
			onClick={click}
			className=" rounded-lg p-1 w-[96%]	 text-white text-sm "
		>
			<div className="flex   rounded-lg  bg-stone-900 items-center m-0.5 ">
				<div className="hidden md:block">
					<img
						className=" w-8 h-8 rounded-full m-2 "
						src={profile_pic}
						alt=""
					/>
				</div>

				<div className="w-[76%] mr-1 px-2">
					<h4 className="">{firstName}</h4>
					<p className="   truncate wrap-anywhere text-[10px]">{text || ""}</p>
					<div className="text-right mr-1 text-[10px]">
						{time ? <Time time={time} /> : ""}
					</div>
				</div>
			</div>
		</div>
	);
}
