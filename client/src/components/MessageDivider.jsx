import React from "react";
import Time from "./Time";

export default function MessageDivider({ date }) {
	return (
		<div className="relative flex  items-center text-[12px]">
			<div className="flex-grow border-t border-stone-900"></div>
			<span className="flex-shrink mx-1 text-gray-400">
				<small>
					<Time time={date} />
				</small>
			</span>
			<div class="flex-grow border-t border-stone-900"></div>
		</div>
	);
}
