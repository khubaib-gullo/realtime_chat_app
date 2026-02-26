import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";
import base_url from "../export";

const useStore = create((set) => ({
	isAuth: null,
	fetchData: async () => {
		try {
			const response = await axios.get(`${base_url}/api/auth/check`, {
				withCredentials: true,
			});
			console.log("response for zustand " + response.data);
			set({ isAuth: response.data.isAllow });
		} catch (err) {
			console.log(err);
		}
	},
	login: () => set({ isAuth: true }),
	logout: () => set({ isAuth: false }),
}));

export default useStore;
