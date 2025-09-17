import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
const connect_to_cloudinary = () => {
	cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
	});
	console.log("cloudiianry connected ");
};

// Upload an image
const uploadResult = async (fileBuffer) => {
	// const buffer = Buffer.from(fileBuffer);
	const file = "data:image/png;base64," + fileBuffer.toString("base64");
	// Upload an image
	const uploadResult = await cloudinary.uploader.upload(file).catch((error) => {
		console.log(error);
	});

	console.log(uploadResult.secure_url);
	return uploadResult.secure_url;
};

export default connect_to_cloudinary;
export { uploadResult };
// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
// 	fetch_format: "auto",
// 	quality: "auto",
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
// 	crop: "auto",
// 	gravity: "auto",
// 	width: 500,
// 	height: 500,
// });

// console.log(autoCropUrl);
