const parse = async (res) => {
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(data.error || (!text || res.status >= 500 ? 'Cannot reach the server. Is the backend running on port 5000?' : 'Request failed'));
  return data;
};

export const api = async (path, method = 'GET', body) => {
  const token = localStorage.getItem('vy_token');
  const res = await fetch('/api/' + path, {
    method, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: body && JSON.stringify(body),
  });
  return parse(res);
};

export const upload = async (file) => {
  const fd = new FormData(); fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + localStorage.getItem('vy_token') }, body: fd });
  return parse(res);
};
