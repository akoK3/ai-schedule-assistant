const express = require('express');
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const { parseIntent } = require('../services/ai');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // get user's existing events so AI knows their schedule
    const events = await Event.find({ userId: req.user.userId });

    // send message + events to AI, get back a structured action
    const result = await parseIntent(message, events);

    // now execute whatever the AI decided to do
    if (result.action === 'create_event') {
      await Event.create({
        userId: req.user.userId,
        title: result.event.title,
        start: new Date(result.event.start),
        end: new Date(result.event.end),
        notes: result.event.notes || ''
      });
    }

    else if (result.action === 'delete_event') {
      await Event.findOneAndDelete({
        userId: req.user.userId,
        title: new RegExp(result.event.title, 'i') // case insensitive match
      });
    }

    else if (result.action === 'update_event') {
      await Event.findOneAndUpdate(
        { userId: req.user.userId, title: new RegExp(result.event.title, 'i') },
        { title: result.event.title, start: new Date(result.event.start), end: new Date(result.event.end), notes: result.event.notes },
        { new: true }
      );
    }

    // send the AI's friendly reply back to the frontend
    res.json({ reply: result.reply, action: result.action });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;