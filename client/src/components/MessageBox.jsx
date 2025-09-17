import React, { useState } from "react";
import MessageDivider from "./MessageDivider";
import Time from "./Time";
import CircularProgress from "@mui/material/CircularProgress";

export default function MessageBox({ text, date, isSender, media }) {
	const [isRight, setIsRight] = useState(isSender);
	const [image, setImage] = useState(true);

	const handelLoad = () => {
		// alert("image loaded ");
		setImage(false);
	};

	return (
		<div dir={isSender ? "rtl" : "ltr"}>
			<MessageDivider date={date} />

			<div>
				<p className=" m-1 w-[45%] bg-stone-600 wrap-anywhere text-white  rounded-lg px-2 py-1  text-[10px] text-left">
					{text}
				</p>

				<div
					dir={isSender ? "rtl" : "ltr"}
					className={
						isRight
							? `mx-2 text-right text-white text-[10px]`
							: `mx-2 text-left text-white text-[10px]`
					}
				>
					{media && (
						<div className="w-30 h-30 text-center flex justify-center items-center ">
							<img
								loading="lazy"
								onLoad={handelLoad}
								className="rounded-lg border-2 border-stone-600 w-50 h-30"
								src={media}
								alt=""
							/>
						</div>
					)}

					<Time time={date} />
				</div>
			</div>
		</div>
	);
}
