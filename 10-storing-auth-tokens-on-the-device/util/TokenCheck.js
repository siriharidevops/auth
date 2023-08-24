import { AsyncStorage } from 'react-native';


const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken) {
      const response = await fetch('your-refresh-token-endpoint', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('accessToken', data.accessToken);
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



const checkTokenValidity = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Check if the token expiration time (exp) is greater than the current time
    return decodedToken.exp > currentTime;
  } catch (error) {
    // Handle decoding errors (e.g., invalid token format)
    return false;
  }
};



// Before making an API call
const checkTokenAndMakeRequest = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  if (accessToken) {
    // Check if the access token is still valid
    const isAccessTokenValid = checkTokenValidity(accessToken);
    if (!isAccessTokenValid) {
      await refreshToken();
    }
    // Proceed with the API call using the valid access token
  } else {
    // User needs to log in
  }
};

// Call this function before every API call
checkTokenAndMakeRequest();
