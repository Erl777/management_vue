import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:3000/api",
  // process.env.APP_BASE_API
  headers: {
    "Content-type": "application/json"
  }
});

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('managementToken');
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

axios.interceptors.response.use((config) => config, (error) => {
  // if (error?.response?.data?.code === 'invalid_jwt_token') {
  //   store.dispatch('app/logout');
  //   app.router.push({ name: ENUMS.ROUTES.AUTH.SIGNIN });
  // }
  return Promise.reject(error);
});

// Vue.prototype.$axios = http;
export default axios

// export default (context) => {
//   const {
//     app,
//     Vue,
//     store,
//     ssrContext,
//   } = context;
//
//   const axios = Axios.create({
//     baseURL: process.env.API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     // paramsSerializer: (params) => stringify(params, {
//     //   arrayFormat: 'brackets',
//     // }),
//   });
//

//
//   Vue.prototype.$axios = axios;
//   app.$axios = axios;
//   store.$axios = axios;
// };
