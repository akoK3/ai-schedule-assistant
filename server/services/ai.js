const fetch = require('node-fetch');

async function parseIntent(message, events) {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayName = days[now.getDay()];
  const todayStr = now.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are a schedule assistant. The user will send you a message about their schedule.
You must respond ONLY with a valid JSON object, no markdown, no explanation, nothing else.

The JSON must have these keys:
- action: one of "create_event", "delete_event", "update_event", "query", "none"
- event: object with title (string), start (ISO date string), end (ISO date string), notes (string). null if action is query or none.
- reply: a friendly short message to show the user confirming what you did or answering their question.

Today is ${todayStr} and the current time is ${timeStr} Eastern Time (ET, UTC-4).
IMPORTANT DATE RULES:
- When user says "Tuesday", find the next upcoming Tuesday from today. If today is Monday May 11, next Tuesday is May 12.
- When user says "tomorrow", that is the day after today.
- When user says a time without AM/PM like "4:00" or "6:00", assume PM unless context suggests otherwise.
- Always return start and end times as ISO strings converted to UTC. ET is UTC-4, so 4:00 PM ET = 20:00 UTC = "2026-05-12T20:00:00.000Z"
- Default event duration is 1 hour unless specified.

The user's current events are: ${JSON.stringify(events)}`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  return JSON.parse(text);
}

module.exports = { parseIntent };