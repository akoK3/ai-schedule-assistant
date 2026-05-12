const cron = require('node-cron');
const Event = require('../models/Event');

module.exports = (io) => {
  // this runs every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const in20 = new Date(now.getTime() + 20 * 60 * 1000); // 20 minutes from now

      // find events starting in the next 20 minutes that haven't been reminded yet
      const upcoming = await Event.find({
        start: { $gte: now, $lte: in20 },
        reminded: false
      });

      upcoming.forEach(async (event) => {
        // push reminder to the specific user's socket room
        io.to(`user:${event.userId}`).emit('reminder', {
          title: event.title,
          start: event.start,
          message: `"${event.title}" starts in about 20 minutes!`
        });

        // mark as reminded so it doesn't fire again
        await Event.findByIdAndUpdate(event._id, { reminded: true });
      });

    } catch (err) {
      console.error('Scheduler error:', err.message);
    }
  });
};