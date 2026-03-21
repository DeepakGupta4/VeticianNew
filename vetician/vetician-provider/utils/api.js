// Axios replacement using fetch API
const api = {
  get: async (url, config = {}) => {
    const response = await fetch(url, {
      method: 'GET',
      headers: config.headers || {},
    });
    return { data: await response.json(), status: response.status };
  },
  
  post: async (url, data, config = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify(data),
    });
    return { data: await response.json(), status: response.status };
  },
  
  put: async (url, data, config = {}) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...config.headers },
      body: JSON.stringify(data),
    });
    return { data: await response.json(), status: response.status };
  },
  
  delete: async (url, config = {}) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: config.headers || {},
    });
    return { data: await response.json(), status: response.status };
  },
};

export default api;
