import axios from 'axios';
import checkTokenValidity from './checkTokenValidity';
// import { refreshToken } from  // Implement your refresh token logic
import { refreshToken } from './refreshToken'



const useAxios_test = axios.create({
    baseURL: 'http://192.168.0.107:8080/api', // Your API base URL
});

// Request interceptor
useAxios_test.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem('token');
    if (accessToken) {
      // Attach the valid access token to the request headers
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
useAxios_test.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error (e.g., refresh token logic)
      await refreshToken();
      // Retry the failed request or perform other actions
    }
    return Promise.reject(error);
  }
);

useAxios_test.get('/user/profile/')
  .then(response => {
    console.log("-===============test=====",response)
  })
  .catch(error => {
    // Handle the error
  });
console.log("==========apiInstance=========",useAxios_test)
export default useAxios_test;
