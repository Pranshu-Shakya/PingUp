import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';

// add post
export const addPost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {content, post_type} = req.body;
        const images = req.files;

        let image_urls = [];
        if(images && images.length > 0) {
            image_urls = await Promise.all(images.map(async (image) => {
                const fileBuffer = fs.readFileSync(image.path);
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalname,
                    folder: "posts"
                })
                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        {quality: "auto"},
                        {format: "webp"},
                        {width: "1280"}
                    ]
                })
                return url;
            }))
        }
        await Post.create({
            user: userId,
            content,
            image_urls,
            post_type
        })
        return res.status(201).json({ success: true, message: "Post created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// get posts
export const getFeedPosts = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        // user connections and followings
        const userIds = [userId, ...user.connections, ...user.following];
        const posts = await Post.find({user: {$in: userIds}}).populate("user").sort({createdAt: -1});
        return res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// like post
export const likePost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {postId} = req.body;
        
        const post = await Post.findById(postId);
        if(post.likes_count.includes(userId)) {
            // unlike
            post.likes_count = post.likes_count.filter(id => id !== userId);
            await post.save();
            res.status(200).json({ success: true, message: "Post unliked" });
        } else {
            // like
            post.likes_count.push(userId);
            await post.save();
            res.status(200).json({ success: true, message: "Post liked" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}