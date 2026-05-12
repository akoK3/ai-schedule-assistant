const fetch = require('node-fetch');

async function parseIntent(message, events) {
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

Today's date and time is: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} Eastern Time.
The user is in New York (ET, UTC-4). 
IMPORTANT: When the user says a time like "7:00" or "6:00" without AM/PM, assume PM unless context suggests otherwise.
Always return start and end times as ISO strings adjusted for UTC-4.
For example, 7:00 PM ET = 23:00 UTC = "2026-05-13T23:00:00.000Z"
Default event duration is 1 hour unless specified.
The user's current events are: ${JSON.stringify(events)}`,
      messages: [{ role: 'user', content: message }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  return JSON.parse(text);
}

module.exports = { parseIntent };