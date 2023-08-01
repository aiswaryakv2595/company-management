import axios from "axios";
import querySting from "query-string";

const baseUrl = 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('token');

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: params => querySting.stringify({ params }),
  headers: {
    'Content-Type': 'application/json',
  }
});

axiosClient.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
    const multipartApis = [
      '/admin/addproject',
      '/admin/edit-project',
      '/details',
      '/update-profile'
      
    ];
  
    if (multipartApis.some(api => config.url.startsWith(api))) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  });
axiosClient.interceptors.response.use(response=>{
    if(response && response.data) 
    return response.data
    return response
    
}, err => {
    if(!err.response){
        return alert(err)
    }
    throw err.response
})
export default axiosClient 