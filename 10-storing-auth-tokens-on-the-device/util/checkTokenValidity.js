import jwtDecode from 'jwt-decode';


const checkTokenValidity = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 600000; // Convert to seconds
  
      // Check if the token expiration time (exp) is greater than the current time
      return decodedToken.exp > currentTime;
    } catch (error) {
      // Handle decoding errors (e.g., invalid token format)
      return false;
    }
  };

  
export default checkTokenValidity;