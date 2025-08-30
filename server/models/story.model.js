import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
	{
		user: {
			type: String, // User _id is a Clerk string ID
			ref: "User",
			required: true,
		},
		content: {
			type: String,
		},
		media_url: {
			type: String,
		},
		media_type: {
			type: String,
			enum: ["image", "video", "text"],
		},
		views_count: [
			{
				type: String, // align with User._id type
				ref: "User",
			},
		],
		background_color: {
			type: String,
		},
	},
	{ timestamps: true, minimize: false }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
