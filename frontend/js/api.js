const API_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }
  return data;
}

function isLoggedIn() {
  return !!getToken();
}

function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

function isAdmin() {
  const user = getUser();
  return user && user.role === 'admin';
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

function requireAdmin() {
  requireAuth();
  if (!isAdmin()) {
    window.location.href = 'dashboard.html';
  }
}

function showAlert(containerId, message, type = 'error') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}
