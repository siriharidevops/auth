import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState, useContext  } from 'react';

export const AuthContext = createContext({
  accessToken: '',
  refreshToken: '',
  isAuthenticated: false,
  authenticate: (accessToken) => {},
  logout: () => {},
});

export function useAuthContext() {
  return useContext(AuthContext);
}

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authRefreshToken, setAuthRefreshToken] = useState();

  function authenticate(accessToken,refreshToken) {
    setAuthToken(accessToken);
    setAuthRefreshToken(refreshToken)
    AsyncStorage.setItem('accessToken', accessToken);
    AsyncStorage.setItem('refreshToken', refreshToken);
    console.log("============= END================",AsyncStorage.setItem('accessToken', accessToken));
  }

  function logout() {
    setAuthToken(null);
    setAuthRefreshToken(null)
    AsyncStorage.removeItem('accessToken');
    AsyncStorage.removeItem('refreshToken');
  }
  

  const value = {
    accessToken: authToken,
    setAccessToken : setAuthToken,
    refreshToken: authRefreshToken,
    isAuthenticated: !!authToken && !!authRefreshToken,
    authenticate: authenticate,
    logout: logout,
  };
  console.log("authToken",authToken)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
export default AuthContextProvider;
