import React, { useState } from "react";

export default function Time({ time }) {
	const msg_time = new Date(time).toLocaleTimeString();
	const msg_date = new Date(time).toLocaleDateString();
	const now = new Date().toLocaleTimeString();

	return (
		<div>
			<small> {msg_time > now ? msg_date : msg_time} </small>
		</div>
	);
}
