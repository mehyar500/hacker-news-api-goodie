import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  timeout: 5000,
});

// retry logic for timeouts (up to 3 times)
api.interceptors.response.use(undefined, async error => {
  const config = error.config;
  if (!config || !config.retry) config.retry = 0;
  if (error.code === 'ECONNABORTED' && config.retry < 3) {
    config.retry += 1;
    return api(config);
  }
  return Promise.reject(error);
});

export default api;