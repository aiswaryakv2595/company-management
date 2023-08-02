import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://52.66.200.73:5000/api' 
});
export const baseURL = 'http://52.66.200.73:5000/';