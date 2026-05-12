const API = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

// redirect to login if no token
if (!token) window.location.href = '/index.html';

async function loadEvents() {
  const res = await fetch(`${API}/events`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const events = await res.json();
  renderEvents(events);
}

function renderEvents(events) {
  const list = document.getElementById('events-list');

  if (events.length === 0) {
    list.innerHTML = '<p style="color:#888; font-size:14px">No events yet. Try telling the AI to add one!</p>';
    return;
  }

  // sort by start time
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

  list.innerHTML = events.map(event => `
    <div class="event-card">
      <div class="event-info">
        <h4>${event.title}</h4>
        <p>${formatDate(event.start)} → ${formatDate(event.end)}</p>
        ${event.notes ? `<p style="margin-top:4px; color:#aaa">${event.notes}</p>` : ''}
      </div>
      <div class="event-actions">
        <button class="delete-btn" onclick="deleteEvent('${event._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function deleteEvent(id) {
  await fetch(`${API}/events/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  loadEvents(); // refresh the list
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  window.location.href = '/index.html';
}

// load events when page opens
loadEvents();