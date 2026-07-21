// Shared API utility for rider-portal
const BASE = '/api/rider';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
});

export const api = {
  post: (path, body) =>
    fetch(`${BASE}${path}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  get: (path) =>
    fetch(`${BASE}${path}`, { headers: getHeaders() }).then(r => r.json()),
  put: (path, body) =>
    fetch(`${BASE}${path}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  delete: (path) =>
    fetch(`${BASE}${path}`, { method: 'DELETE', headers: getHeaders() }).then(r => r.json()),
};
