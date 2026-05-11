const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

export const api = {
  menu: {
    list:   ()        => request('GET',    '/menu'),
    create: (data)    => request('POST',   '/menu', data),
    update: (id, data)=> request('PUT',    `/menu/${id}`, data),
    delete: (id)      => request('DELETE', `/menu/${id}`),
  },
  orders: {
    list:   ()        => request('GET',    '/orders'),
    create: (data)    => request('POST',   '/orders', data),
    update: (id, data)=> request('PUT',    `/orders/${id}`, data),
    delete: (id)      => request('DELETE', `/orders/${id}`),
  },
  tables: {
    list:   ()        => request('GET',    '/tables'),
    create: (data)    => request('POST',   '/tables', data),
    update: (id, data)=> request('PUT',    `/tables/${id}`, data),
    delete: (id)      => request('DELETE', `/tables/${id}`),
  },
  inventory: {
    list:   ()        => request('GET',    '/inventory'),
    create: (data)    => request('POST',   '/inventory', data),
    update: (id, data)=> request('PUT',    `/inventory/${id}`, data),
    delete: (id)      => request('DELETE', `/inventory/${id}`),
  },
};
