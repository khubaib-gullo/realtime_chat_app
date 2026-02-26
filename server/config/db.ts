// import mongoose from "mongoose";
// export async function DB() {
// 	mongoose
// 		.connect(process.env.MONOGO_URI)
// 		.then(() => {
// 			console.log("DB connected ");
// 		})
// 		.catch((err) => {
// 			console.log("error " + err);
// 		});
// }

import mongoose from "mongoose";

export const DB = async () => {
	mongoose
		.connect(process.env.MONOGO_URI as string)
		.then(() => console.log("database connected "))
		.catch((e) => console.log("erro while conecting to database " + e));
};
