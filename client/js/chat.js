let recognition = null;
let isListening = false;

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  // show user message in chat
  appendMessage(message, 'user');
  input.value = '';

  // show typing indicator
  appendMessage('...', 'ai', 'typing-indicator');

  try {
    const res = await fetch(`${API}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // remove typing indicator
    document.getElementById('typing-indicator')?.remove();

    // show AI reply
    appendMessage(data.reply, 'ai');

    // if AI created/deleted/updated an event, refresh the list
    if (['create_event', 'delete_event', 'update_event'].includes(data.action)) {
      loadEvents();
    }

  } catch (err) {
    document.getElementById('typing-indicator')?.remove();
    appendMessage('Sorry, something went wrong.', 'ai');
  }
}

function appendMessage(text, sender, id = '') {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.textContent = text;
  if (id) div.id = id;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight; // auto scroll to bottom
}

function toggleVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert('Voice input not supported in this browser. Try Chrome.');
    return;
  }

  if (isListening) {
    recognition.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.speechRecognitionList = null; 
  recognition.maxAlternatives = 1; 
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    document.getElementById('voice-btn').classList.add('listening');
    document.getElementById('voice-btn').textContent = '⏹';
  };

  recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  document.getElementById('chat-input').value = transcript;
  recognition.stop();
  sendMessage();
  };

  recognition.onend = () => {
    isListening = false;
    document.getElementById('voice-btn').classList.remove('listening');
    document.getElementById('voice-btn').textContent = '🎤';
  };

  recognition.start();
}