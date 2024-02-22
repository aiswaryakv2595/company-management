import axios from 'axios';

export const api = axios.create({
  baseURL: ' https://strategix-backend.onrender.com/api' 
});
export const baseURL = 'https://strategix-backend.onrender.com';