import { AsyncStorage } from 'react-native';


const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      const response = await fetch('http://192.168.0.107:8080/api/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.accessToken);
        // Retry the original API call that failed due to token expiration
        // You might need to implement a queue for pending API calls
      } else {
        // Handle refresh token request error
        // Logout user or handle the error appropriately
      }
    } else {
      // No refresh token available, user needs to log in again
    }
  } catch (error) {
    // Handle exceptions
  }
};

export default refreshToken;