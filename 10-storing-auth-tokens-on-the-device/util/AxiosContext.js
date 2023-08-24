import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext} from 'react';
import axios from 'axios';
import {AuthContext, AuthContextProvider, useAuthContext} from '../store/auth-context';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
// import * as Keychain from 'react-native-keychain';

const AxiosContext = createContext();
const {Provider} = AxiosContext;

const AxiosProvider = ({children}) => {
  // const authContext = useContext(AuthContext);
  const { accessToken, setAccessToken,refreshToken } = useContext(AuthContext)
  // const authCtx = useContext(AuthContext);
  // const accessToken = authCtx.token;


  const authAxios = axios.create({
    baseURL: 'http://192.168.0.102:8080/user',
  });

  const publicAxios = axios.create({
    baseURL: 'http://192.168.0.102:8080/user',
  });

  authAxios.interceptors.request.use(
    config => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  // const token = AsyncStorage.getItem('accessToken');
  //   console.log("tttttttttttttttttttttttt",token )

  const refreshAuthLogic = async failedRequest => {
    console.log("hiiii")
    
    // const token = await AsyncStorage.getItem('refreshToken');
    const token = refreshToken;
    const data = {
      refresh: token,
    };

    const options = {
      method: 'POST',
      data,
      url: 'http://192.168.0.102:8080/api/token/refresh/',
    };
    
    // console.log("refresh***************",authContext)

    return axios(options)
      .then(async tokenRefreshResponse => {
        // console.log("refresh***************",tokenRefreshResponse.data.access)
        failedRequest.response.config.headers.Authorization =
          'Bearer ' + tokenRefreshResponse.data.access;

        // authContext.authenticate({
        //   ...authContext.authState,
        //   accessToken: tokenRefreshResponse.data.access,
        // });

        setAccessToken(tokenRefreshResponse.data.access)
        // AsyncStorage.setItem('accessToken', tokenRefreshResponse.data.accessx);
       

        // await Keychain.setGenericPassword(
        //   'token',
        //   JSON.stringify({
        //     accessToken: tokenRefreshResponse.data.access,
        //     refreshToken: authContext.authState.refreshToken,
        //   }),
        // );

        return Promise.resolve();
      })
      .catch(e => {
        console.log("**refresh caatch",e)
        
        authContext.setAuthState({
          accessToken: null,
          refreshToken: null,
        });
      });
  };

  createAuthRefreshInterceptor(authAxios, refreshAuthLogic, {});

  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </Provider>
  );
};

export {AxiosContext, AxiosProvider};
