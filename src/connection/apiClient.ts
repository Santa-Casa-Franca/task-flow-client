import axios from 'axios';
require('dotenv/config');
const baseURL =  process.env.NEXT_PUBLIC_API_AUTOMATION_SERVER;
console.log(baseURL)
const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;