import axios from 'axios';

// On crée une instance d'axios avec une configuration par défaut
const api = axios.create({
  baseURL: 'http://localhost:3000', // L'adresse de votre backend Node.js
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;