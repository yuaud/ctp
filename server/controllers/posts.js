import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    /* these things the only things front end going to send to back end */
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    /* when we save created post, we are grabbing all posts because post list updated
        and front end needs most updated list. Thats why we are grabbing all the posts here
        after we saved our created post(posts list updated) then sending it to front end */
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    /* status 409 = the request could not be processed because of conflict in the request */
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPosts = await Post.find({ userId });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    /* get id from query params */
    const { id } = req.params;
    /* userId is going to send by front end */
    const { userId } = req.body;
    /* grabbing post information */
    const post = await Post.findById(id);
    /* is this user liked the post or not */
    const isLiked = post.likes.get(userId);
    /* if user already liked the post then remove the like  else like the post*/
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }
    /* update post and return updated post */
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
