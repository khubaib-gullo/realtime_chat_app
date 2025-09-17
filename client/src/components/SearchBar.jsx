import React from "react";

export default function SearchBar({ showBar, onkeydown, onchange, value }) {
	return (
		<div className="flex  mb-2  ">
			<input
				value={value}
				className=" w-[94%] px-2 my-2  bg-stone-900  rounded-full  text-white text-bg focus:border-stone-600 focus:outline placeholder:text-[12px] outline-0"
				type="text"
				placeholder="Search......"
				name="search"
				onChange={onchange}
				onKeyDown={onkeydown}
			/>
		</div>
	);
}
