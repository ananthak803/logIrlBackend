const express=require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router=express.Router();
const User=require('../models/user')

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    let existingEmail = await User.findOne({ email });
    if (existingEmail) return res.json({ msg: "email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = new User({
      email,
      password: hashedPassword,
    });
    await createUser.save();

    const payload = { id: createUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.send("Server error in routes/auth.js");
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Invalid credentials" });

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", 
    });

    res.json({ token }); 
  } catch (err) {
    console.error(err.message);
  }
});



module.exports=router