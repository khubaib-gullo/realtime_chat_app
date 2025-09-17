import { create } from "zustand";
import axios from "axios";
import { useEffect } from "react";

const useStore = create((set) => ({
	isAuth: null,
	fetchData: async () => {
		try {
			const response = await axios.get("http://localhost:4000/api/auth/check", {
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
