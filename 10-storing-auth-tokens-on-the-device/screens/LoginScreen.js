import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import AuthContent from '../components/Auth/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';
import {AxiosContext} from '../util/AxiosContext';
// import publicAxios from '../util/AxiosContext';

export const publicAxios = axios.create({
  baseURL: 'http://192.168.0.102:8080/user',
});


function LoginScreen() {
  
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);
  // const {publicAxios} = useContext(AxiosContext);
  

  async function loginHandler({ phone, password }) {
    setIsAuthenticating(true);
    try {
      console.log("=============LoginPage================",publicAxios);

      const result = await publicAxios.post('/login/', {
        phone_number: phone,
        password: password,
      }).catch(err => console.log('Login: ', err));
      console.log("=============LoginPage END================");
      console.log(result.data.access,result.data.refresh)
      authCtx.authenticate(result.data.access,result.data.refresh);
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
