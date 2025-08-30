import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";
import { inngest } from "../inngest/index.js";

// add user story
export const addUserStory = async (req, res) => {
	try {
		const { userId } = req.auth();
		const { content, media_type, background_color } = req.body;
		const media = req.file;
		let media_url = "";

		// upload media to imageKit

		if (media_type === "image" || media_type === "video") {
			const fileBuffer = fs.readFileSync(media.path);
			const response = await imagekit.upload({
				file: fileBuffer,
				fileName: media.originalname,
			});
			media_url = response.url;
		}

		// create story
		const story = await Story.create({
			user: userId,
			content,
			media_url,
			media_type,
			background_color,
		});

		// schedule story deletion after 24 hours
		await inngest.send({
			name: "app/story.delete",
			data: { storyId: story._id },
		});

		res.status(201).json({ success: true, message: "Story created successfully", story });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// get user stories
export const getStories = async (req, res) => {
	try {
		const { userId } = req.auth();
		const user = await User.findById(userId);

		// user connections and followings
		const userIds = [userId, ...user.connections, ...user.following];
		const stories = await Story.find({
			user: { $in: userIds },
		})
			.populate("user")
			.sort({ createdAt: -1 });
		res.status(200).json({ success: true, stories });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });
	}
};
