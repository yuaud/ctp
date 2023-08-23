import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    /* status 404 =  either did not find a current representation
         or is trying to hide its existence from an unauthorized client.*/
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    /* getting all your friends */
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    /* proper format for the front end */
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    /* user.friends.includes(friendId) = if friendId is included in the user.friends array */
    /* if friendId is already inside of the user's friend list array then we want to remove,
        if it isn't then we want to add that friend's id in to our user's friend list array */
    if (user.friends.includes(friendId)) {
      /* removing your friend from your friend list and also
            removing you from your friend's friend list (two-way road) */
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = user.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    /* getting all your friends and formatting it for front end */
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
