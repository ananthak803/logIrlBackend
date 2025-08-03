const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// POST /api/logs/addLog
router.post('/addLog', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); 

    if (!user) return res.status(404).json({ message: 'User not found' });

    const { date, title, time, description } = req.body;
    console.log(title);
    console.log(time);
    console.log(description);

    let dateEntry = user.userData.find(entry => entry.date === date);

    if (!dateEntry) {
      user.userData.push({
        date,
        logs: [{ title, time, description }]
      });
    } else {
      dateEntry.logs.push({ title, time, description });
    }

    await user.save();
    res.json({ message: 'Log saved successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save log' });
  }
});


// GET /api/logs/getLogs
router.get('/getLogs', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      logs: user.userData.map(entry => ({
        date: entry.date,
        logs: entry.logs
      }))
    });

  } catch (err) {
    console.error('Error in getLogs:', err);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
});

module.exports = router;
