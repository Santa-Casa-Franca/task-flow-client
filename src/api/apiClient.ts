// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // Base URL da sua API
  headers: {
    'Content-Type': 'application/json',
    // Adicione headers específicos aqui, se necessário
  },
});

export default apiClient;
