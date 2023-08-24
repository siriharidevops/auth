import axios from 'axios';
import checkTokenValidity from './checkTokenValidity';
// import { refreshToken } from  // Implement your refresh token logic
import { refreshToken } from './refreshToken'



const useAxios = axios.create({
    baseURL: 'http://192.168.0.107:8080/api', // Your API base URL
});

// Request interceptor
useAxios.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem('token');
    if (accessToken) {
      const isAccessTokenValid = checkTokenValidity(accessToken);
      if (!isAccessTokenValid) {
        await refreshToken();
      }
      // Attach the valid access token to the request headers
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
useAxios.interceptors.response.use(
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
console.log("==========apiInstance=========",useAxios)
export default useAxios;
