import axios from 'axios';


const BASE_URL = 'http://192.168.0.107:8080/api'
async function authenticate(phone, password) {
  //const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const url = `${BASE_URL}/user/login/`

//   axios.get(`http://192.168.0.107:8080/api/user/profile/`)
//  .then(res => console.log(res))
//  .catch(err => console.log('Login: ', err));
  console.log("data",password,phone)
  const response = await axios.post(url, {
    phone_number: phone,
    password: password,
  });
// }).then(res => console.log(res))
// .catch(err => console.log('Login: ', err))
  const token = response.data.token.access;
  const refreshToken = response.data.token.refresh;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  return { token: token, refreshToken: refreshToken};
}


async function create_user(phone, password,email,user_name) {
  //const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const url = `${BASE_URL}/user/register/`
//   axios.get(`http://192.168.0.107:8080/api/user/profile/`)
//  .then(res => console.log(res))
//  .catch(err => console.log('Login: ', err));
  data = {
    email: email,
    phone_number: phone,
    name: user_name,
    password: password,
    password2: password,

  }
  const response = await axios.post(url, data,
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }, 
  }
  
  ).catch(err => console.log('sigup: ', err));;
// }).then(res => console.log(res))
// .catch(err => console.log('Login: ', err));
  console.log("login response",response)
  
  const token = response.data.token.access;
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

  return token;
}

// async function welcome_page() {
//   const url = `${BASE_URL}/user/register/`
//   const response = await axios.get(url);
//   return response.data
// }

export function createUser(phone, password,email,user_name) {
  return create_user(phone, password,email,user_name);
}

export function login(phone, password) {
  return authenticate(phone, password);
}

// export function welcomePage() {
//   return welcome_page();
// }