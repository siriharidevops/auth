import axios from 'axios';
import { useContext, useEffect, useState } from 'react';

import { StyleSheet, Text, View, Button  } from 'react-native';
import { AuthContext } from '../store/auth-context';
// import { AxiosContext } from '../util/Interceptor'
// import authAxios  from '../util/AxiosContext';


import { AxiosContext } from '../util/AxiosContext'

function WelcomeScreen() {
  const axiosContext = useContext(AxiosContext);
  const [users, setUsers] = useState(null);
  // const authCtx = useContext(AuthContext);
  // const token = authCtx.token;
  const [reloadKey, setReloadKey] = useState(0);
  const [status, setStatus] = useState('idle');
  

  const fetchData = async () => {
    try {
      console.log("==========Welcome page=============")
      const response = await axiosContext.authAxios.get('/list/');
      // console.log("apiInstance11",useAxios)
      // console.log(response.data);
      setUsers(response.data);
      console.log("==========Welcome page END=============")
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
    
  //   // console.log("apiInstance",useAxios)
  //   const r=fetchData()
  //   // useAxios_test()
  //   // console.log("************************apiInstance",r)

  // })


  // useEffect(() => {
    
    
  //   console.log("**********:",axios.defaults.headers.common['Authorization'] )
  //   axiosContext.authAxios.get('/user/profile/')
  //     .then((response) => {
  //       setUsers(response.data);
  //     }).catch(err => console.log('Welcome page: ', err));
  //     ;
  // }, []);

  const loadImage = async () => {
    setStatus('loading');
    try {
      console.log("***************")
      // console.log(axiosContext.authAxios.config.headers.Authorization )
      const response = await axiosContext.authAxios.get('/list/');
      // console.log("***************",response)
      setUsers(response.data);
      console.log(response.data)
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <View style={styles.rootContainer}>
       {/* <Button title="Reload" onPress={handleReload} /> */}
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      <Button title="Load details" onPress={loadImage} />
      <View>
      {users ? <Text>existing1</Text> : <Text>not exist</Text>}
      {users ? (
        <View>
          <Text>Email: {users.email}</Text>
          <Text>ID: {users.id}</Text>
          <Text>Name: {users.name}</Text>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    
      </View>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
