import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://35.154.239.241:5000/api' 
});
export const baseURL = 'http://35.154.239.241:5000/';