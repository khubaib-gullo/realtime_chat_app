import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import MsgArea from "./components/MsgArea";

function App() {
	const [show, setShow] = useState(true);
	const [theme, setTheme] = useState(true);

	return (
		<div className="bg-black flex justify-center py-10">
			<div className="w-[90%] p-5 h-[700px] ">
				<MsgArea theme={theme} className="" />
			</div>
		</div>
	);
}

export default App;
