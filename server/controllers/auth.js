import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTERING */
export const register = async (req, res) => {
  /* you have to send these variables from req.body or else it wont work
    (register func shouldn't even work without these variables) */
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    /* generate random bcrypt key func */
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      /* generating random numbers for making these look like more realistic */
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 200000),
    });
    const savedUser = await newUser.save();
    /* status 201 = something has been created. */
    res.status(201).json(savedUser);
  } catch (err) {
    /* status 500 = unexpected condition or configuration problem */
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* status 400 = due to something that is perceived to be a client error  */
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    /* deleting password bcs we don't want to send password to front-end for safety */
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    /* status 500 = unexpected condition or configuration problem */
    res.status(500).json({ error: err.message });
  }
};
