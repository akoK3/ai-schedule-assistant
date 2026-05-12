const userId = localStorage.getItem('userId');
const socketUrl = window.location.origin;

const socket = io(socketUrl);

socket.on('connect', () => {
  socket.emit('join', userId);
});

socket.on('reminder', (data) => {
  showToast(data.message, data.title);
});

function showToast(message, title) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <h4>⏰ Reminder</h4>
    <p>${message}</p>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 8000);
}