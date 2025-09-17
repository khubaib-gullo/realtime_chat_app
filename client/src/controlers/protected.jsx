import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";
import Alert from "@mui/material/Alert";
import useStore from "../hooks/authCheck";

export default function ProtectedRoutes(props) {
	const isAuth = useStore((state) => state.isAuth);

	return isAuth ? <Outlet /> : <Navigate to="/login" />;
}
