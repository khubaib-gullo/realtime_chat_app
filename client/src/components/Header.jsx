import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import useStore from "../hooks/authCheck";

export default function Header(props) {
	const [anchorEl, setAnchorEl] = useState(null);

	const { isAuth, fetchData } = useStore();

	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className=" bg-black rounded-lg  fixed  w-full   border-stone-600  border-b-1 h-10  flex justify-between justify-items-center ">
			<div className="m-1">
				<Button
					id="basic-button"
					aria-controls={open ? "basic-menu" : undefined}
					aria-haspopup="true"
					aria-expanded={open ? "true" : undefined}
					onClick={handleClick}
					sx={{ color: "white " }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
				</Button>

				<Menu
					id="basic-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					slotProps={{
						list: {
							"aria-labelledby": "basic-button",
						},
					}}
				>
					<Link to="/profile">
						<MenuItem onClick={handleClose}>Profile</MenuItem>
					</Link>
					<Link to="/app">
						<MenuItem onClick={handleClose}>app</MenuItem>
					</Link>
					<Link to="/login">
						<MenuItem onClick={handleClose}>login</MenuItem>
					</Link>
					<Link to="/logout">
						<MenuItem onClick={handleClose}>logout</MenuItem>
					</Link>
				</Menu>
			</div>
			<div className="mx-5">
				<Button sx={{ color: " white" }}>
					{isAuth ? (
						<Link to="/logout"> logout</Link>
					) : (
						<Link to="/login"> login</Link>
					)}
				</Button>
			</div>
		</div>
	);
}
