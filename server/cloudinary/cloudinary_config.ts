// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// // Configuration
// const connect_to_cloudinary = () => {
// 	cloudinary.config({
// 		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 		api_key: process.env.CLOUDINARY_API_KEY,
// 		api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
// 	});
// 	console.log("cloudiianry connected ");
// };

// // Upload an image
// const uploadResult = async (fileBuffer) => {
// 	// const buffer = Buffer.from(fileBuffer);
// 	const file = "data:image/png;base64," + fileBuffer.toString("base64");
// 	// Upload an image
// 	const uploadResult = await cloudinary.uploader.upload(file).catch((error) => {
// 		console.log(error);
// 	});

// 	console.log(uploadResult.secure_url);
// 	return uploadResult.secure_url;
// };

// export default connect_to_cloudinary;
// export { uploadResult };

import { v2 as cloudinary } from "cloudinary";

// Configuration
const connect_to_cloudinary = (): void => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
		api_key: process.env.CLOUDINARY_API_KEY as string,
		api_secret: process.env.CLOUDINARY_API_SECRET as string,
	});
	console.log("cloudinary connected");
};

// Upload an image
const uploadResult = async (fileBuffer: Buffer | string): Promise<string> => {
	let file: string;

	if (typeof fileBuffer === "string") {
		file = "data:image/png;base64," + fileBuffer;
	} else {
		file = "data:image/png;base64," + fileBuffer.toString("base64");
	}

	const result = await cloudinary.uploader.upload(file).catch((error) => {
		console.log(error);
		throw new Error("Cloudinary upload failed");
	});

	return result.secure_url;
};

export default connect_to_cloudinary;
export { uploadResult };
